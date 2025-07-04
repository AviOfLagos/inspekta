'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Listing } from '@/types/listing';

interface CreateListingFormProps {
  agentId: string;
  onSuccess?: (listing: Listing) => void;
  onCancel?: () => void;
}

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
}

export function CreateListingForm({ agentId, onSuccess, onCancel }: CreateListingFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    price: '',
    address: '',
    city: '',
    state: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: [] as string[],
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const listingTypes = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOUSE', label: 'House' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'OFFICE', label: 'Office' },
    { value: 'WAREHOUSE', label: 'Warehouse' },
    { value: 'RETAIL', label: 'Retail' },
    { value: 'LAND', label: 'Land' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use uploaded image URLs for the listing
      const imageUrls = uploadedImages.map(img => img.url);
      
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: imageUrls, // Use uploaded image URLs
          agentId,
        }),
      });

      if (response.ok) {
        const { listing } = await response.json();
        onSuccess?.(listing);
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'APARTMENT',
          price: '',
          address: '',
          city: '',
          state: '',
          bedrooms: '',
          bathrooms: '',
          area: '',
          images: [],
        });
        setUploadedImages([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Create listing error:', error);
      alert('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };


  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    
    // Add all selected files to form data
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { images } = await response.json();
        setUploadedImages(prev => [...prev, ...images]);
        toast.success(`${images.length} image${images.length > 1 ? 's' : ''} uploaded successfully`);
      } else {
        const error = await response.json();
        toast.error(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeUploadedImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/upload/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Image removed');
      } else {
        const error = await response.json();
        toast.error(`Failed to remove image: ${error.error}`);
      }
    } catch (error) {
      console.error('Image removal error:', error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Beautiful 3BR Apartment in Victoria Island"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the property features, amenities, and highlights..."
                className="w-full p-2 border rounded-md min-h-[100px] resize-vertical"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Property Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {listingTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 50000000"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="e.g., 123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Lagos"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="e.g., Lagos"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Details</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <Label htmlFor="area">Area (sqm)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="e.g., 120"
                />
              </div>
            </div>
          </div>


          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Images</h3>
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                disabled={uploadingImages}
              />
              
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload images
                  </span>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">
                  JPG, PNG, WebP up to 10MB each (max 10 files)
                </p>
              </label>
            </div>

            {uploadingImages && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Uploading images...
              </div>
            )}

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Uploaded Images ({uploadedImages.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                        <Image
                          src={image.url}
                          alt={image.originalName}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeUploadedImage(image.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate" title={image.originalName}>
                        {image.originalName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}