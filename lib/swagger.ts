import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Inspekta Platform API',
        description: 'Comprehensive real estate marketplace and inspection platform API for Nigeria',
        version: '1.0.0',
        contact: {
          name: 'Inspekta Support',
          email: 'support@inspekta.com',
          url: 'https://inspekta.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://api.inspekta.com',
          description: 'Production server'
        }
      ],
      tags: [
        {
          name: 'Authentication',
          description: 'User authentication and authorization endpoints'
        },
        {
          name: 'Properties',
          description: 'Property listing management endpoints'
        },
        {
          name: 'Users',
          description: 'User profile and management endpoints'
        },
        {
          name: 'Inspections',
          description: 'Property inspection booking and management'
        },
        {
          name: 'Companies',
          description: 'Multi-tenant company management'
        },
        {
          name: 'Subscriptions',
          description: 'User subscription and payment management'
        },
        {
          name: 'Earnings',
          description: 'Earnings tracking and payout management'
        },
        {
          name: 'Verification',
          description: 'User verification and compliance'
        },
        {
          name: 'Notifications',
          description: 'WhatsApp and email notification system'
        }
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'inspekta-session',
            description: 'Session cookie for authenticated requests'
          }
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique user identifier'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address'
              },
              name: {
                type: 'string',
                description: 'User full name'
              },
              role: {
                type: 'string',
                enum: ['CLIENT', 'AGENT', 'INSPECTOR', 'COMPANY_ADMIN', 'PLATFORM_ADMIN'],
                description: 'User role determining access permissions'
              },
              isVerified: {
                type: 'boolean',
                description: 'Email verification status'
              },
              companyId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Associated company ID for multi-tenant support'
              }
            },
            required: ['id', 'email', 'role', 'isVerified']
          },
          RegisterRequest: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address'
              },
              password: {
                type: 'string',
                minLength: 8,
                description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)'
              },
              confirmPassword: {
                type: 'string',
                description: 'Password confirmation (must match password)'
              },
              name: {
                type: 'string',
                minLength: 2,
                description: 'User full name'
              },
              phone: {
                type: 'string',
                pattern: '^(\\+234|0)[789]\\d{9}$',
                description: 'Nigerian phone number (optional)'
              },
              role: {
                type: 'string',
                enum: ['CLIENT', 'AGENT', 'INSPECTOR', 'COMPANY_ADMIN'],
                description: 'User role'
              },
              companyId: {
                type: 'string',
                format: 'uuid',
                description: 'Company ID for association (optional)'
              }
            },
            required: ['email', 'password', 'confirmPassword', 'name', 'role']
          },
          LoginRequest: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address'
              },
              password: {
                type: 'string',
                description: 'User password'
              }
            },
            required: ['email', 'password']
          },
          Listing: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique listing identifier'
              },
              title: {
                type: 'string',
                description: 'Property title'
              },
              description: {
                type: 'string',
                description: 'Property description'
              },
              price: {
                type: 'number',
                description: 'Property price in Naira'
              },
              location: {
                type: 'string',
                description: 'Property location'
              },
              type: {
                type: 'string',
                enum: ['APARTMENT', 'HOUSE', 'OFFICE', 'LAND'],
                description: 'Property type'
              },
              bedrooms: {
                type: 'integer',
                minimum: 0,
                description: 'Number of bedrooms'
              },
              bathrooms: {
                type: 'integer',
                minimum: 0,
                description: 'Number of bathrooms'
              },
              size: {
                type: 'string',
                description: 'Property size (e.g., "120 sqm")'
              },
              status: {
                type: 'string',
                enum: ['AVAILABLE', 'PENDING', 'SOLD'],
                description: 'Property availability status'
              },
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'uri'
                },
                description: 'Property image URLs'
              },
              amenities: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Property amenities'
              },
              yearBuilt: {
                type: 'integer',
                minimum: 1900,
                maximum: 2100,
                description: 'Year the property was built'
              },
              agentId: {
                type: 'string',
                format: 'uuid',
                description: 'ID of the listing agent'
              },
              agent: {
                $ref: '#/components/schemas/Agent'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp'
              }
            },
            required: ['id', 'title', 'price', 'location', 'type', 'status', 'agentId']
          },
          Agent: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              name: {
                type: 'string'
              },
              email: {
                type: 'string',
                format: 'email'
              },
              phone: {
                type: 'string'
              },
              agentProfile: {
                type: 'object',
                properties: {
                  bio: {
                    type: 'string'
                  },
                  yearsExperience: {
                    type: 'integer'
                  },
                  specializations: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          ApiResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: 'Indicates if the request was successful'
              },
              message: {
                type: 'string',
                description: 'Human-readable response message'
              },
              error: {
                type: 'string',
                description: 'Error message if success is false'
              },
              details: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Detailed error messages for validation failures'
              }
            },
            required: ['success']
          },
          ValidationError: {
            allOf: [
              {
                $ref: '#/components/schemas/ApiResponse'
              },
              {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    enum: [false]
                  },
                  error: {
                    type: 'string',
                    example: 'Validation failed'
                  },
                  details: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['Email is required', 'Password must be at least 8 characters']
                  }
                }
              }
            ]
          },
          Inspection: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique inspection identifier'
              },
              type: {
                type: 'string',
                enum: ['virtual', 'physical'],
                description: 'Type of inspection'
              },
              status: {
                type: 'string',
                enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
                description: 'Inspection status'
              },
              scheduledFor: {
                type: 'string',
                format: 'date-time',
                description: 'Scheduled inspection date and time'
              },
              propertyId: {
                type: 'string',
                format: 'uuid',
                description: 'Associated property ID'
              },
              inspectorId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Assigned inspector ID'
              },
              agentId: {
                type: 'string',
                format: 'uuid',
                description: 'Agent who scheduled the inspection'
              },
              meetingLink: {
                type: 'string',
                format: 'uri',
                nullable: true,
                description: 'Google Meet link for virtual inspections'
              },
              maxParticipants: {
                type: 'integer',
                default: 10,
                description: 'Maximum number of participants allowed'
              },
              participants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    joinedAt: { type: 'string', format: 'date-time' }
                  }
                }
              },
              recordingUrl: {
                type: 'string',
                format: 'uri',
                nullable: true,
                description: 'URL to inspection recording'
              }
            },
            required: ['id', 'type', 'status', 'scheduledFor', 'propertyId', 'agentId']
          },
          Subscription: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              userId: {
                type: 'string',
                format: 'uuid'
              },
              plan: {
                type: 'string',
                enum: ['client_monthly', 'agent_monthly', 'company_monthly'],
                description: 'Subscription plan type'
              },
              status: {
                type: 'string',
                enum: ['active', 'cancelled', 'expired', 'pending'],
                description: 'Subscription status'
              },
              price: {
                type: 'number',
                description: 'Monthly subscription price in Naira'
              },
              startDate: {
                type: 'string',
                format: 'date',
                description: 'Subscription start date'
              },
              endDate: {
                type: 'string',
                format: 'date',
                description: 'Subscription end date'
              },
              features: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Included features'
              }
            },
            required: ['id', 'userId', 'plan', 'status', 'price']
          },
          NotificationRequest: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['whatsapp', 'email', 'both'],
                description: 'Notification delivery method'
              },
              recipient: {
                type: 'string',
                description: 'Phone number or email address'
              },
              message: {
                type: 'string',
                description: 'Notification message content'
              },
              templateType: {
                type: 'string',
                enum: ['inspection_reminder', 'verification_complete', 'payment_received'],
                description: 'Predefined message template'
              }
            },
            required: ['type', 'recipient', 'message']
          }
        },
        responses: {
          Success: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                }
              }
            }
          },
          ValidationError: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError'
                }
              }
            }
          },
          Unauthorized: {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          enum: [false]
                        },
                        error: {
                          type: 'string',
                          example: 'Not authenticated'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          Forbidden: {
            description: 'Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          enum: [false]
                        },
                        error: {
                          type: 'string',
                          example: 'Insufficient permissions'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          NotFound: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          enum: [false]
                        },
                        error: {
                          type: 'string',
                          example: 'Resource not found'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          ServerError: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          enum: [false]
                        },
                        error: {
                          type: 'string',
                          example: 'Internal server error'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      security: [
        {
          cookieAuth: []
        }
      ]
    }
  });
  return spec;
};