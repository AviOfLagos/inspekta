import { prisma } from '@/lib/prisma';
import { NotificationType } from '@/lib/generated/prisma';
import { sendEmail } from '@/lib/email';
import { 
  createInspectionScheduledEmail, 
  createInspectorAssignedEmail, 
  createInspectionCompletedEmail,
  createNewJobAvailableEmail 
} from '@/lib/email-templates/inspection-emails';

// Import real-time broadcast functions (only on server-side)
let broadcastNotificationToUser: ((userId: string, notification: any) => boolean) | undefined;
let broadcastNotificationToUsers: ((userIds: string[], notification: any) => number) | undefined;

// Dynamically import SSE functions to avoid client-side issues
const initializeBroadcast = async () => {
  if (typeof window === 'undefined' && !broadcastNotificationToUser) {
    try {
      const sseModule = await import('@/lib/sse-server');
      broadcastNotificationToUser = sseModule.broadcastNotificationToUser;
      broadcastNotificationToUsers = sseModule.broadcastNotificationToUsers;
    } catch (error) {
      console.warn('Real-time notifications not available:', error);
    }
  }
};

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  inspectionId?: string;
  listingId?: string;
  paymentId?: string;
  metadata?: any;
}

export class NotificationService {
  /**
   * Create a notification for a user
   */
  static async createNotification(params: CreateNotificationParams) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          inspectionId: params.inspectionId,
          listingId: params.listingId,
          paymentId: params.paymentId,
          metadata: params.metadata,
        },
      });

      // Initialize broadcast functions if not already done
      await initializeBroadcast();

      // Send real-time notification if user is connected
      if (broadcastNotificationToUser) {
        const sent = broadcastNotificationToUser(params.userId, notification);
        console.log(`Real-time notification ${sent ? 'sent' : 'queued'} for user ${params.userId}`);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create notifications for multiple users
   */
  static async createBulkNotifications(
    userIds: string[],
    params: Omit<CreateNotificationParams, 'userId'>
  ) {
    try {
      const notifications = await prisma.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          type: params.type,
          title: params.title,
          message: params.message,
          inspectionId: params.inspectionId,
          listingId: params.listingId,
          paymentId: params.paymentId,
          metadata: params.metadata,
        })),
      });

      // Initialize broadcast functions if not already done
      await initializeBroadcast();

      // Send real-time notifications to connected users
      if (broadcastNotificationToUsers) {
        const notificationData = {
          type: params.type,
          title: params.title,
          message: params.message,
          inspectionId: params.inspectionId,
          listingId: params.listingId,
          paymentId: params.paymentId,
          metadata: params.metadata,
          createdAt: new Date().toISOString(),
        };
        
        const sentCount = broadcastNotificationToUsers(userIds, notificationData);
        console.log(`Real-time notifications sent to ${sentCount}/${userIds.length} connected users`);
      }

      return notifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Notification templates for common actions
   */
  static templates = {
    inspectionScheduled: (inspectionId: string, propertyTitle: string) => ({
      type: 'INSPECTION_SCHEDULED' as NotificationType,
      title: 'Inspection Scheduled',
      message: `Your inspection for "${propertyTitle}" has been scheduled successfully.`,
      inspectionId,
    }),

    inspectionAccepted: (inspectionId: string, propertyTitle: string, inspectorName: string) => ({
      type: 'INSPECTION_ACCEPTED' as NotificationType,
      title: 'Inspector Assigned',
      message: `${inspectorName} has accepted your inspection request for "${propertyTitle}".`,
      inspectionId,
    }),

    inspectionCompleted: (inspectionId: string, propertyTitle: string) => ({
      type: 'INSPECTION_COMPLETED' as NotificationType,
      title: 'Inspection Completed',
      message: `The inspection for "${propertyTitle}" has been completed.`,
      inspectionId,
    }),

    inquiryReceived: (listingId: string, propertyTitle: string, clientName: string) => ({
      type: 'INQUIRY_RECEIVED' as NotificationType,
      title: 'New Inquiry',
      message: `${clientName} has sent an inquiry about "${propertyTitle}".`,
      listingId,
    }),

    paymentReceived: (paymentId: string, amount: number) => ({
      type: 'PAYMENT_RECEIVED' as NotificationType,
      title: 'Payment Received',
      message: `Payment of ₦${amount.toLocaleString()} has been received.`,
      paymentId,
    }),

    listingSaved: (listingId: string, propertyTitle: string) => ({
      type: 'LISTING_SAVED' as NotificationType,
      title: 'Property Saved',
      message: `Someone saved your property "${propertyTitle}" to their favorites.`,
      listingId,
    }),

    verificationApproved: () => ({
      type: 'VERIFICATION_APPROVED' as NotificationType,
      title: 'Verification Approved',
      message: 'Your account verification has been approved. You can now access all features.',
    }),

    verificationRejected: (reason?: string) => ({
      type: 'VERIFICATION_REJECTED' as NotificationType,
      title: 'Verification Rejected',
      message: reason 
        ? `Your account verification was rejected: ${reason}`
        : 'Your account verification was rejected. Please contact support.',
    }),
  };

  /**
   * Helper method to create common notifications
   */
  static async notifyInspectionScheduled(
    userId: string,
    inspectionId: string,
    propertyTitle: string
  ) {
    const template = this.templates.inspectionScheduled(inspectionId, propertyTitle);
    return this.createNotification({
      userId,
      ...template,
    });
  }

  static async notifyInspectionAccepted(
    userId: string,
    inspectionId: string,
    propertyTitle: string,
    inspectorName: string
  ) {
    const template = this.templates.inspectionAccepted(inspectionId, propertyTitle, inspectorName);
    return this.createNotification({
      userId,
      ...template,
    });
  }

  static async notifyInspectionCompleted(
    userId: string,
    inspectionId: string,
    propertyTitle: string
  ) {
    const template = this.templates.inspectionCompleted(inspectionId, propertyTitle);
    return this.createNotification({
      userId,
      ...template,
    });
  }

  static async notifyInquiryReceived(
    agentId: string,
    listingId: string,
    propertyTitle: string,
    clientName: string
  ) {
    const template = this.templates.inquiryReceived(listingId, propertyTitle, clientName);
    return this.createNotification({
      userId: agentId,
      ...template,
    });
  }

  static async notifyPaymentReceived(
    userId: string,
    paymentId: string,
    amount: number
  ) {
    const template = this.templates.paymentReceived(paymentId, amount);
    return this.createNotification({
      userId,
      ...template,
    });
  }

  static async notifyListingSaved(
    agentId: string,
    listingId: string,
    propertyTitle: string
  ) {
    const template = this.templates.listingSaved(listingId, propertyTitle);
    return this.createNotification({
      userId: agentId,
      ...template,
    });
  }

  static async notifyVerificationApproved(userId: string) {
    const template = this.templates.verificationApproved();
    return this.createNotification({
      userId,
      ...template,
    });
  }

  static async notifyVerificationRejected(userId: string, reason?: string) {
    const template = this.templates.verificationRejected(reason);
    return this.createNotification({
      userId,
      ...template,
    });
  }

  /**
   * Inspection-specific notification methods with email integration
   */
  static async notifyInspectionScheduledWithEmail(
    inspection: any,
    client: { id: string; name: string; email: string }
  ) {
    try {
      // Create in-app notification
      await this.notifyInspectionScheduled(
        client.id,
        inspection.id,
        inspection.listing.title
      );

      // Send email notification
      const emailData = {
        propertyTitle: inspection.listing.title,
        propertyLocation: inspection.listing.location,
        inspectionType: inspection.type,
        scheduledAt: inspection.scheduledAt,
        inspectionId: inspection.id,
        cost: inspection.fee,
        clientName: client.name,
        agentName: inspection.listing.agent?.name,
      };

      const emailTemplate = createInspectionScheduledEmail(client.email, emailData);
      await sendEmail(emailTemplate);

      console.log(`Inspection scheduled notification sent to ${client.email}`);
    } catch (error) {
      console.error('Error sending inspection scheduled notification:', error);
    }
  }

  static async notifyInspectorAssignedWithEmail(
    inspection: any,
    client: { id: string; name: string; email: string },
    inspector: { id: string; name: string; phone?: string }
  ) {
    try {
      // Create in-app notification
      await this.notifyInspectionAccepted(
        client.id,
        inspection.id,
        inspection.listing.title,
        inspector.name
      );

      // Send email notification
      const emailData = {
        propertyTitle: inspection.listing.title,
        propertyLocation: inspection.listing.location,
        inspectionType: inspection.type,
        scheduledAt: inspection.scheduledAt,
        inspectionId: inspection.id,
        cost: inspection.fee,
        clientName: client.name,
        agentName: inspection.listing.agent?.name,
        inspectorName: inspector.name,
        inspectorPhone: inspector.phone,
      };

      const emailTemplate = createInspectorAssignedEmail(client.email, emailData);
      await sendEmail(emailTemplate);

      console.log(`Inspector assigned notification sent to ${client.email}`);
    } catch (error) {
      console.error('Error sending inspector assigned notification:', error);
    }
  }

  static async notifyInspectionCompletedWithEmail(
    inspection: any,
    client: { id: string; name: string; email: string },
    inspector: { name: string; phone?: string },
    reportUrl?: string
  ) {
    try {
      // Create in-app notification
      await this.notifyInspectionCompleted(
        client.id,
        inspection.id,
        inspection.listing.title
      );

      // Send email notification
      const emailData = {
        propertyTitle: inspection.listing.title,
        propertyLocation: inspection.listing.location,
        inspectionType: inspection.type,
        scheduledAt: inspection.scheduledAt,
        inspectionId: inspection.id,
        cost: inspection.fee,
        clientName: client.name,
        agentName: inspection.listing.agent?.name,
        inspectorName: inspector.name,
        inspectorPhone: inspector.phone,
        reportUrl,
      };

      const emailTemplate = createInspectionCompletedEmail(client.email, emailData);
      await sendEmail(emailTemplate);

      console.log(`Inspection completed notification sent to ${client.email}`);
    } catch (error) {
      console.error('Error sending inspection completed notification:', error);
    }
  }

  static async notifyNewJobAvailableWithEmail(
    inspection: any,
    inspectors: Array<{ id: string; email: string }>,
    client: { name: string }
  ) {
    try {
      // Create in-app notifications for all inspectors
      await this.createBulkNotifications(
        inspectors.map(i => i.id),
        {
          type: 'NEW_JOB_AVAILABLE',
          title: 'New Inspection Job Available',
          message: `New ${inspection.type.toLowerCase()} inspection available for "${inspection.listing.title}".`,
          inspectionId: inspection.id,
          listingId: inspection.listing.id,
        }
      );

      // Send email notifications to all inspectors
      const emailPromises = inspectors.map(async (inspector) => {
        const emailData = {
          propertyTitle: inspection.listing.title,
          propertyLocation: inspection.listing.location,
          inspectionType: inspection.type,
          scheduledAt: inspection.scheduledAt,
          inspectionId: inspection.id,
          cost: inspection.fee,
          clientName: client.name,
        };

        const emailTemplate = createNewJobAvailableEmail(inspector.email, emailData);
        return sendEmail(emailTemplate);
      });

      await Promise.allSettled(emailPromises);
      console.log(`New job notification sent to ${inspectors.length} inspectors`);
    } catch (error) {
      console.error('Error sending new job notifications:', error);
    }
  }
}