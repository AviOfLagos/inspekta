import { EmailTemplate } from '@/lib/email';

// Base styles for inspection emails
const baseStyles = `
  <style>
    .email-container { 
      max-width: 600px; 
      margin: 0 auto; 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
    }
    .header { 
      background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: bold; 
    }
    .content { 
      padding: 30px; 
      background: #ffffff; 
    }
    .inspection-card { 
      background: #f8fafc; 
      border: 1px solid #e2e8f0; 
      border-radius: 12px; 
      padding: 24px; 
      margin: 20px 0; 
    }
    .property-title { 
      font-size: 20px; 
      font-weight: bold; 
      color: #1e293b; 
      margin-bottom: 8px; 
    }
    .inspection-details { 
      display: grid; 
      gap: 12px; 
      margin: 16px 0; 
    }
    .detail-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 8px 0; 
      border-bottom: 1px solid #e2e8f0; 
    }
    .detail-label { 
      font-weight: 600; 
      color: #64748b; 
    }
    .detail-value { 
      font-weight: 500; 
      color: #1e293b; 
    }
    .button { 
      display: inline-block; 
      background: #6366f1; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      margin: 10px 5px; 
    }
    .button-secondary { 
      background: #f8fafc; 
      color: #6366f1; 
      border: 2px solid #6366f1; 
    }
    .next-steps { 
      background: #eff6ff; 
      border-left: 4px solid #3b82f6; 
      padding: 20px; 
      margin: 20px 0; 
    }
    .footer { 
      background: #1e293b; 
      color: #94a3b8; 
      padding: 30px; 
      text-align: center; 
      font-size: 14px; 
    }
    .status-badge { 
      display: inline-block; 
      padding: 4px 12px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: 600; 
      text-transform: uppercase; 
    }
    .status-scheduled { 
      background: #dbeafe; 
      color: #1d4ed8; 
    }
    .status-confirmed { 
      background: #dcfce7; 
      color: #166534; 
    }
    .status-completed { 
      background: #f0fdf4; 
      color: #15803d; 
    }
  </style>
`;

interface InspectionEmailData {
  propertyTitle: string;
  propertyLocation: string;
  inspectionType: 'VIRTUAL' | 'PHYSICAL';
  scheduledAt: string;
  inspectionId: string;
  cost: number;
  clientName: string;
  agentName?: string;
  inspectorName?: string;
  inspectorPhone?: string;
  meetingLink?: string;
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date and time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  };
};

export function createInspectionScheduledEmail(
  userEmail: string,
  data: InspectionEmailData
): EmailTemplate {
  const { date, time } = formatDateTime(data.scheduledAt);
  
  return {
    to: userEmail,
    subject: `🏠 Inspection Scheduled - ${data.propertyTitle}`,
    html: `
      ${baseStyles}
      <div class="email-container">
        <div class="header">
          <h1>🏠 Inspection Scheduled</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Your property inspection has been successfully scheduled
          </p>
        </div>

        <div class="content">
          <p>Hi ${data.clientName},</p>
          
          <p>Great news! Your inspection request has been confirmed. Here are the details:</p>

          <div class="inspection-card">
            <div class="property-title">${data.propertyTitle}</div>
            <p style="color: #64748b; margin: 0 0 16px 0;">📍 ${data.propertyLocation}</p>
            
            <div class="inspection-details">
              <div class="detail-row">
                <span class="detail-label">Inspection Type</span>
                <span class="detail-value">
                  <span class="status-badge status-scheduled">
                    ${data.inspectionType === 'VIRTUAL' ? '🖥️ Virtual' : '🏠 Physical'}
                  </span>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${date} at ${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Inspection Fee</span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">
                  ${formatCurrency(data.cost)}
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID</span>
                <span class="detail-value">#${data.inspectionId.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div class="next-steps">
            <h3 style="margin: 0 0 12px 0; color: #1e40af;">📋 What Happens Next</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✅ Available inspectors have been notified</li>
              <li>🔍 An inspector will be assigned within 2-4 hours</li>
              <li>📞 You'll receive inspector contact details 24h before the inspection</li>
              ${data.inspectionType === 'VIRTUAL' ? 
                '<li>🔗 Google Meet link will be shared 1 hour before the inspection</li>' : 
                '<li>📱 Inspector will contact you to confirm timing and access</li>'
              }
              <li>📄 Detailed inspection report delivered within 24 hours</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/inspections" class="button">
              View My Inspections
            </a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/listings/${data.inspectionId}" class="button button-secondary">
              Property Details
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #64748b;">
            <strong>Need to reschedule or cancel?</strong><br>
            Contact us at <a href="mailto:support@inspekta.com">support@inspekta.com</a> 
            or call <a href="tel:+2348000000000">+234 800 000 0000</a>
          </p>
        </div>

        <div class="footer">
          <p><strong>Inspekta</strong> - Nigeria's Premier Property Inspection Platform</p>
          <p>Making property inspection transparent, convenient, and reliable.</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #94a3b8;">Visit Platform</a> | 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #94a3b8;">Support</a> | 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #94a3b8;">Contact</a>
          </p>
        </div>
      </div>
    `
  };
}

export function createInspectorAssignedEmail(
  userEmail: string,
  data: InspectionEmailData
): EmailTemplate {
  const { date, time } = formatDateTime(data.scheduledAt);
  
  return {
    to: userEmail,
    subject: `🎯 Inspector Assigned - ${data.propertyTitle}`,
    html: `
      ${baseStyles}
      <div class="email-container">
        <div class="header">
          <h1>🎯 Inspector Assigned</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Your inspection is confirmed with a certified inspector
          </p>
        </div>

        <div class="content">
          <p>Hi ${data.clientName},</p>
          
          <p>Excellent! A certified inspector has been assigned to your upcoming inspection:</p>

          <div class="inspection-card">
            <div class="property-title">${data.propertyTitle}</div>
            <p style="color: #64748b; margin: 0 0 16px 0;">📍 ${data.propertyLocation}</p>
            
            <div class="inspection-details">
              <div class="detail-row">
                <span class="detail-label">Inspector</span>
                <span class="detail-value">
                  <span class="status-badge status-confirmed">
                    👨‍🔧 ${data.inspectorName}
                  </span>
                </span>
              </div>
              
              ${data.inspectorPhone ? `
              <div class="detail-row">
                <span class="detail-label">Inspector Phone</span>
                <span class="detail-value">
                  <a href="tel:${data.inspectorPhone}" style="color: #6366f1;">
                    ${data.inspectorPhone}
                  </a>
                </span>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <span class="detail-label">Scheduled</span>
                <span class="detail-value">${date} at ${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">
                  ${data.inspectionType === 'VIRTUAL' ? '🖥️ Virtual Inspection' : '🏠 Physical Inspection'}
                </span>
              </div>
            </div>
          </div>

          ${data.inspectionType === 'VIRTUAL' ? `
          <div class="next-steps">
            <h3 style="margin: 0 0 12px 0; color: #1e40af;">🖥️ Virtual Inspection Guide</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>📱 Google Meet link will be sent 1 hour before the inspection</li>
              <li>🔍 Inspector will guide you through the property via video call</li>
              <li>💬 Ask questions and request focus on specific areas</li>
              <li>📹 Session will be recorded for your records</li>
              <li>📄 Written report with recommendations within 24 hours</li>
            </ul>
          </div>
          ` : `
          <div class="next-steps">
            <h3 style="margin: 0 0 12px 0; color: #1e40af;">🏠 Physical Inspection Guide</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>📞 Inspector will call you 1 day before to confirm timing</li>
              <li>🔑 Ensure property access is arranged</li>
              <li>👥 You're welcome to accompany the inspector</li>
              <li>📸 Detailed photos and measurements will be taken</li>
              <li>📄 Comprehensive written report within 24 hours</li>
            </ul>
          </div>
          `}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/inspections" class="button">
              View Inspection Details
            </a>
            ${data.inspectorPhone ? `
            <a href="tel:${data.inspectorPhone}" class="button button-secondary">
              📞 Contact Inspector
            </a>
            ` : ''}
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #64748b;">
            <strong>Questions about your inspection?</strong><br>
            Contact your inspector directly${data.inspectorPhone ? ` at ${data.inspectorPhone}` : ''} 
            or reach our support team at <a href="mailto:support@inspekta.com">support@inspekta.com</a>
          </p>
        </div>

        <div class="footer">
          <p><strong>Inspekta</strong> - Nigeria's Premier Property Inspection Platform</p>
          <p>Certified inspectors • Detailed reports • Transparent process</p>
        </div>
      </div>
    `
  };
}

export function createInspectionCompletedEmail(
  userEmail: string,
  data: InspectionEmailData & { reportUrl?: string }
): EmailTemplate {
  const { date, time } = formatDateTime(data.scheduledAt);
  
  return {
    to: userEmail,
    subject: `✅ Inspection Complete - ${data.propertyTitle}`,
    html: `
      ${baseStyles}
      <div class="email-container">
        <div class="header">
          <h1>✅ Inspection Complete</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Your property inspection has been completed successfully
          </p>
        </div>

        <div class="content">
          <p>Hi ${data.clientName},</p>
          
          <p>Great news! Your property inspection has been completed. Here's a summary:</p>

          <div class="inspection-card">
            <div class="property-title">${data.propertyTitle}</div>
            <p style="color: #64748b; margin: 0 0 16px 0;">📍 ${data.propertyLocation}</p>
            
            <div class="inspection-details">
              <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value">
                  <span class="status-badge status-completed">
                    ✅ Completed
                  </span>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Inspected By</span>
                <span class="detail-value">👨‍🔧 ${data.inspectorName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Completed On</span>
                <span class="detail-value">${date} at ${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">
                  ${data.inspectionType === 'VIRTUAL' ? '🖥️ Virtual' : '🏠 Physical'} Inspection
                </span>
              </div>
            </div>
          </div>

          <div class="next-steps">
            <h3 style="margin: 0 0 12px 0; color: #15803d;">📄 Your Inspection Report</h3>
            <p style="margin: 0 0 12px 0;">Your detailed inspection report includes:</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>🔍 Comprehensive property assessment</li>
              <li>📸 High-quality photos and documentation</li>
              <li>⚠️ Identified issues and concerns</li>
              <li>✅ Inspector recommendations</li>
              <li>💡 Maintenance suggestions</li>
              ${data.inspectionType === 'VIRTUAL' ? '<li>🎥 Recording of virtual inspection session</li>' : ''}
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            ${data.reportUrl ? `
            <a href="${data.reportUrl}" class="button">
              📄 Download Full Report
            </a>
            ` : ''}
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/inspections" class="button button-secondary">
              View All Inspections
            </a>
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 8px 0; color: #92400e;">💬 Share Your Experience</h4>
            <p style="margin: 0; color: #92400e;">
              How was your inspection experience? Your feedback helps us improve our service.
            </p>
            <div style="margin-top: 12px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback?inspection=${data.inspectionId}" 
                 style="background: #f59e0b; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Leave Feedback
              </a>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #64748b;">
            <strong>Questions about your report?</strong><br>
            Contact the inspector${data.inspectorPhone ? ` at ${data.inspectorPhone}` : ''} 
            or our support team at <a href="mailto:support@inspekta.com">support@inspekta.com</a>
          </p>
        </div>

        <div class="footer">
          <p><strong>Inspekta</strong> - Nigeria's Premier Property Inspection Platform</p>
          <p>Thank you for choosing Inspekta for your property inspection needs!</p>
        </div>
      </div>
    `
  };
}

// Email for inspectors when new job is available
export function createNewJobAvailableEmail(
  inspectorEmail: string,
  data: InspectionEmailData
): EmailTemplate {
  const { date, time } = formatDateTime(data.scheduledAt);
  
  return {
    to: inspectorEmail,
    subject: `🚨 New Inspection Job Available - ${formatCurrency(data.cost)}`,
    html: `
      ${baseStyles}
      <div class="email-container">
        <div class="header">
          <h1>🚨 New Job Available</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            A new inspection job is available in your area
          </p>
        </div>

        <div class="content">
          <p>Hi there,</p>
          
          <p>A new ${data.inspectionType.toLowerCase()} inspection job is available. Act fast to secure this opportunity!</p>

          <div class="inspection-card">
            <div class="property-title">${data.propertyTitle}</div>
            <p style="color: #64748b; margin: 0 0 16px 0;">📍 ${data.propertyLocation}</p>
            
            <div class="inspection-details">
              <div class="detail-row">
                <span class="detail-label">Job Fee</span>
                <span class="detail-value" style="color: #059669; font-weight: bold; font-size: 18px;">
                  ${formatCurrency(data.cost * 0.6)} <!-- 60% to inspector -->
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Scheduled</span>
                <span class="detail-value">${date} at ${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">
                  <span class="status-badge status-scheduled">
                    ${data.inspectionType === 'VIRTUAL' ? '🖥️ Virtual' : '🏠 Physical'}
                  </span>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Client</span>
                <span class="detail-value">${data.clientName}</span>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/inspector/jobs" class="button" style="font-size: 16px; padding: 16px 32px;">
              🎯 Accept This Job
            </a>
          </div>

          <div class="next-steps">
            <h3 style="margin: 0 0 12px 0; color: #dc2626;">⏰ Act Quickly</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>🏃‍♂️ Jobs are assigned on a first-come, first-served basis</li>
              <li>📱 Log in to your inspector dashboard to accept</li>
              <li>💰 Payment processed within 48 hours after completion</li>
              <li>⭐ Build your rating with quality inspections</li>
            </ul>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #64748b;">
            <strong>Can't take this job?</strong><br>
            No problem! More opportunities are always coming. 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/inspector/availability">Update your availability</a> 
            to receive more relevant job notifications.
          </p>
        </div>

        <div class="footer">
          <p><strong>Inspekta</strong> - Connecting Qualified Inspectors with Property Owners</p>
          <p>Professional opportunities • Fair compensation • Flexible schedule</p>
        </div>
      </div>
    `
  };
}