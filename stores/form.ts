import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PropertyType } from '@/lib/generated/prisma';

// Property creation form state
export interface CreateListingFormData {
  // Basic info
  title: string;
  description: string;
  type: PropertyType | '';
  
  // Location
  address: string;
  city: string;
  state: string;
  
  // Details
  bedrooms: string;
  bathrooms: string;
  area: string;
  price: string;
  
  // Media
  images: string[];
  videoUrl: string;
  
  // Current step in multi-step form
  currentStep: number;
  
  // Validation state
  errors: Record<string, string>;
}

// Inspection booking form state
export interface InspectionBookingData {
  // Property info
  listingId: string;
  listingTitle: string;
  
  // Inspection details
  type: 'VIRTUAL' | 'PHYSICAL' | '';
  scheduledAt: string;
  notes: string;
  
  // Payment info
  fee: number;
  paymentMethod: string;
  
  // Current step
  currentStep: number;
  
  // Validation
  errors: Record<string, string>;
}

// User registration form state
export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  role: string;
  
  // Company info (if creating company)
  companyName: string;
  companySubdomain: string;
  companyDescription: string;
  
  // Current step
  currentStep: number;
  
  // Validation
  errors: Record<string, string>;
}

interface FormState {
  // Form data
  listingForm: CreateListingFormData;
  inspectionBooking: InspectionBookingData;
  userRegistration: RegistrationFormData;
  
  // Listing form actions
  updateListingForm: (data: Partial<CreateListingFormData>) => void;
  setListingFormStep: (step: number) => void;
  setListingFormErrors: (errors: Record<string, string>) => void;
  resetListingForm: () => void;
  
  // Inspection booking actions
  updateInspectionBooking: (data: Partial<InspectionBookingData>) => void;
  setInspectionBookingStep: (step: number) => void;
  setInspectionBookingErrors: (errors: Record<string, string>) => void;
  resetInspectionBooking: () => void;
  
  // Registration form actions
  updateUserRegistration: (data: Partial<RegistrationFormData>) => void;
  setUserRegistrationStep: (step: number) => void;
  setUserRegistrationErrors: (errors: Record<string, string>) => void;
  resetUserRegistration: () => void;
  
  // Generic form helpers
  clearAllForms: () => void;
}

// Default form states
const defaultListingForm: CreateListingFormData = {
  title: '',
  description: '',
  type: '',
  address: '',
  city: '',
  state: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  price: '',
  images: [],
  videoUrl: '',
  currentStep: 1,
  errors: {},
};

const defaultInspectionBooking: InspectionBookingData = {
  listingId: '',
  listingTitle: '',
  type: '',
  scheduledAt: '',
  notes: '',
  fee: 0,
  paymentMethod: '',
  currentStep: 1,
  errors: {},
};

const defaultUserRegistration: RegistrationFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  role: '',
  companyName: '',
  companySubdomain: '',
  companyDescription: '',
  currentStep: 1,
  errors: {},
};

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      listingForm: defaultListingForm,
      inspectionBooking: defaultInspectionBooking,
      userRegistration: defaultUserRegistration,
      
      // Listing form actions
      updateListingForm: (data) =>
        set((state) => ({
          listingForm: { ...state.listingForm, ...data }
        })),
      
      setListingFormStep: (step) =>
        set((state) => ({
          listingForm: { ...state.listingForm, currentStep: step }
        })),
      
      setListingFormErrors: (errors) =>
        set((state) => ({
          listingForm: { ...state.listingForm, errors }
        })),
      
      resetListingForm: () =>
        set({ listingForm: defaultListingForm }),
      
      // Inspection booking actions
      updateInspectionBooking: (data) =>
        set((state) => ({
          inspectionBooking: { ...state.inspectionBooking, ...data }
        })),
      
      setInspectionBookingStep: (step) =>
        set((state) => ({
          inspectionBooking: { ...state.inspectionBooking, currentStep: step }
        })),
      
      setInspectionBookingErrors: (errors) =>
        set((state) => ({
          inspectionBooking: { ...state.inspectionBooking, errors }
        })),
      
      resetInspectionBooking: () =>
        set({ inspectionBooking: defaultInspectionBooking }),
      
      // Registration form actions
      updateUserRegistration: (data) =>
        set((state) => ({
          userRegistration: { ...state.userRegistration, ...data }
        })),
      
      setUserRegistrationStep: (step) =>
        set((state) => ({
          userRegistration: { ...state.userRegistration, currentStep: step }
        })),
      
      setUserRegistrationErrors: (errors) =>
        set((state) => ({
          userRegistration: { ...state.userRegistration, errors }
        })),
      
      resetUserRegistration: () =>
        set({ userRegistration: defaultUserRegistration }),
      
      // Generic helpers
      clearAllForms: () =>
        set({
          listingForm: defaultListingForm,
          inspectionBooking: defaultInspectionBooking,
          userRegistration: defaultUserRegistration,
        }),
    }),
    {
      name: 'inspekta-forms', // localStorage key
      partialize: (state) => ({
        // Persist form data but not error states
        listingForm: { ...state.listingForm, errors: {} },
        inspectionBooking: { ...state.inspectionBooking, errors: {} },
        userRegistration: { ...state.userRegistration, errors: {} },
      }),
    }
  )
);

// Selector hooks for specific forms
export const useListingForm = () => useFormStore(state => ({
  form: state.listingForm,
  updateForm: state.updateListingForm,
  setStep: state.setListingFormStep,
  setErrors: state.setListingFormErrors,
  resetForm: state.resetListingForm,
}));

export const useInspectionBookingForm = () => useFormStore(state => ({
  form: state.inspectionBooking,
  updateForm: state.updateInspectionBooking,
  setStep: state.setInspectionBookingStep,
  setErrors: state.setInspectionBookingErrors,
  resetForm: state.resetInspectionBooking,
}));

export const useRegistrationForm = () => useFormStore(state => ({
  form: state.userRegistration,
  updateForm: state.updateUserRegistration,
  setStep: state.setUserRegistrationStep,
  setErrors: state.setUserRegistrationErrors,
  resetForm: state.resetUserRegistration,
}));