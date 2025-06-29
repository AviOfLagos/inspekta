import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/lib/auth';
import { UserRole, FileType } from '@/lib/generated/prisma';
import {prisma} from '@/lib/prisma';

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     tags:
 *       - File Upload
 *     summary: Upload property images
 *     description: Upload multiple images for property listings. Agent role required. Supports JPG, PNG, WebP formats up to 10MB each.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files to upload
 *               propertyId:
 *                 type: string
 *                 description: Optional property ID for organizing uploads
 *           examples:
 *             singleImage:
 *               summary: Upload Single Image
 *               value:
 *                 images: [binary-image-data]
 *                 propertyId: "clm123abc"
 *             multipleImages:
 *               summary: Upload Multiple Images
 *               value:
 *                 images: [binary-image-1, binary-image-2, binary-image-3]
 *                 propertyId: "clm123abc"
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "3 images uploaded successfully"
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "img_1234567890"
 *                           url:
 *                             type: string
 *                             example: "/uploads/images/property-clm123abc-1706441234567.jpg"
 *                           filename:
 *                             type: string
 *                             example: "property-clm123abc-1706441234567.jpg"
 *                           originalName:
 *                             type: string
 *                             example: "beautiful-apartment.jpg"
 *                           size:
 *                             type: number
 *                             example: 1024000
 *                           mimeType:
 *                             type: string
 *                             example: "image/jpeg"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               noFiles:
 *                 summary: No Files Provided
 *                 value:
 *                   success: false
 *                   error: "No images provided"
 *               invalidFileType:
 *                 summary: Invalid File Type
 *                 value:
 *                   success: false
 *                   error: "Only JPG, PNG, and WebP images are allowed"
 *               fileTooLarge:
 *                 summary: File Too Large
 *                 value:
 *                   success: false
 *                   error: "File size must be less than 10MB"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Only agents can upload property images"
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "File size exceeds 10MB limit"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only agents and company admins can upload property images
    if (session.role !== UserRole.AGENT && session.role !== UserRole.COMPANY_ADMIN && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Only agents can upload property images' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const propertyId = formData.get('propertyId') as string || '';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images provided' },
        { status: 400 }
      );
    }

    // Validate file constraints
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_FILES = 10;

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES} images allowed` },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds 10MB limit` },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" must be JPG, PNG, or WebP format` },
          { status: 400 }
        );
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'images');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist, continue
    }

    const uploadedImages = [];

    // Process each file
    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safePropertyId = propertyId ? propertyId.replace(/[^a-zA-Z0-9]/g, '') : 'general';
      const filename = `property-${safePropertyId}-${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save file to filesystem
      const filePath = join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      // Create image record
      const imageRecord = {
        id: `img_${timestamp}_${Math.random().toString(36).substring(2)}`,
        url: `/uploads/images/${filename}`,
        filename,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedById: session.id,
        propertyId: propertyId || null
      };

      uploadedImages.push(imageRecord);
    }

    await prisma.uploadedFile.createMany({
      data: uploadedImages.map(img => ({
        id: img.id,
        filename: img.filename,
        originalName: img.originalName,
        url: img.url,
        size: img.size,
        mimeType: img.mimeType,
        uploadedById: session.id,
        propertyId: img.propertyId,
        type: FileType.IMAGE
      }))
    });

    console.log(`Uploaded ${uploadedImages.length} images for user ${session.email}`);

    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} uploaded successfully`,
      images: uploadedImages
    });

  } catch (error) {
    console.error('Upload images error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/upload/images:
 *   get:
 *     tags:
 *       - File Upload
 *     summary: Get uploaded images
 *     description: Retrieve list of uploaded images for the current user or property
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter images by property ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *         description: Maximum number of images to return
 *     responses:
 *       200:
 *         description: List of uploaded images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       url:
 *                         type: string
 *                       filename:
 *                         type: string
 *                       originalName:
 *                         type: string
 *                       size:
 *                         type: number
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = { type: FileType.IMAGE };
    if (propertyId) {
      where.propertyId = propertyId;
    } else {
      where.uploadedById = session.id;
    }

    const images = await prisma.uploadedFile.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      images
    });

  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve images' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/upload/images/{id}:
 *   delete:
 *     tags:
 *       - File Upload
 *     summary: Delete an uploaded image
 *     description: Deletes a specific image by its ID. Users can only delete their own images.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Image deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "You are not authorized to delete this image"
 *       404:
 *         description: Image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Image not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const image = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete the image
    if (image.uploadedById !== session.id && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to delete this image' },
        { status: 403 }
      );
    }

    // Delete file from filesystem
    const filePath = join(process.cwd(), 'public', image.url);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file from filesystem: ${filePath}`, error);
      // Continue to delete from DB even if file deletion fails
    }

    // Delete file from database
    await prisma.uploadedFile.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
