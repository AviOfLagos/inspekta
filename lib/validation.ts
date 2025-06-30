import { z } from 'zod';
import { UserRole } from './generated/prisma';

// Install zod if not already installed
// pnpm add zod

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  callbackUrl: z.string().optional(),
  intendedRole: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  companyId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Onboarding validation schemas
export const clientOnboardingSchema = z.object({
  preferredLocation: z.string().optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  propertyType: z.string().optional(),
});

export const agentOnboardingSchema = z.object({
  ninNumber: z.string().length(11, 'NIN must be 11 digits').regex(/^\d+$/, 'NIN must contain only numbers'),
  bvnNumber: z.string().length(11, 'BVN must be 11 digits').regex(/^\d+$/, 'BVN must contain only numbers'),
  guarantor1Name: z.string().min(2, 'Guarantor name is required'),
  guarantor1Phone: z.string().min(10, 'Valid phone number is required'),
  guarantor2Name: z.string().min(2, 'Second guarantor name is required'),
  guarantor2Phone: z.string().min(10, 'Valid phone number is required'),
});

export const inspectorOnboardingSchema = z.object({
  ninNumber: z.string().length(11, 'NIN must be 11 digits').regex(/^\d+$/, 'NIN must contain only numbers'),
  bvnNumber: z.string().length(11, 'BVN must be 11 digits').regex(/^\d+$/, 'BVN must contain only numbers'),
  location: z.string().min(2, 'Location is required'),
  availabilityRadius: z.number().min(1, 'Availability radius must be at least 1km').max(100, 'Maximum radius is 100km'),
  guarantorName: z.string().min(2, 'Guarantor name is required'),
  guarantorPhone: z.string().min(10, 'Valid phone number is required'),
});

export const companyOnboardingSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  cacNumber: z.string().min(5, 'CAC registration number is required'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(20, 'Subdomain must be less than 20 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Subdomain cannot start or end with a hyphen'),
  description: z.string().optional(),
  logo: z.string().url().optional(),
});

// Profile update schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Valid phone number is required').optional(),
  image: z.string().url().optional(),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Utility types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ClientOnboardingInput = z.infer<typeof clientOnboardingSchema>;
export type AgentOnboardingInput = z.infer<typeof agentOnboardingSchema>;
export type InspectorOnboardingInput = z.infer<typeof inspectorOnboardingSchema>;
export type CompanyOnboardingInput = z.infer<typeof companyOnboardingSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Common validation patterns
export const patterns = {
  phone: /^(\+234|0)[789]\d{9}$/,
  nin: /^\d{11}$/,
  bvn: /^\d{11}$/,
  subdomain: /^[a-z0-9-]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
};

// Error messages
export const errorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid Nigerian phone number',
  nin: 'NIN must be exactly 11 digits',
  bvn: 'BVN must be exactly 11 digits',
  passwordWeak: 'Password must contain uppercase, lowercase, number, and special character',
  passwordMismatch: "Passwords don't match",
  subdomainInvalid: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
  unauthorized: 'You are not authorized to perform this action',
  sessionExpired: 'Your session has expired. Please login again',
};