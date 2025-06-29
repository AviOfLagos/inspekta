import { prisma } from '@/lib/prisma';
import { NotificationType } from '@/lib/generated/prisma';

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
}