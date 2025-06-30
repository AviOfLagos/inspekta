import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Theme state
  theme: Theme;
  
  // Navigation state
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Modal state
  currentModal: string | null;
  modalData: any;
  
  // Loading states for different actions
  loading: Record<string, boolean>;
  
  // Notification preferences
  notificationPreferences: {
    sound: boolean;
    desktop: boolean;
    email: boolean;
  };
  
  // Actions
  setTheme: (theme: Theme) => void;
  
  // Navigation actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  
  // Modal actions
  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;
  
  // Loading actions
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: () => void;
  
  // Notification preferences
  updateNotificationPreferences: (preferences: Partial<UIState['notificationPreferences']>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: false,
      mobileMenuOpen: false,
      currentModal: null,
      modalData: null,
      loading: {},
      notificationPreferences: {
        sound: true,
        desktop: true,
        email: true,
      },
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Navigation actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      
      // Modal actions
      openModal: (modal, data = null) => set({ currentModal: modal, modalData: data }),
      closeModal: () => set({ currentModal: null, modalData: null }),
      
      // Loading actions
      setLoading: (key, loading) => 
        set((state) => ({
          loading: { ...state.loading, [key]: loading }
        })),
      
      clearLoading: () => set({ loading: {} }),
      
      // Notification preferences
      updateNotificationPreferences: (preferences) =>
        set((state) => ({
          notificationPreferences: { ...state.notificationPreferences, ...preferences }
        })),
    }),
    {
      name: 'inspekta-ui', // localStorage key
      partialize: (state) => ({
        // Persist user preferences but not temporary state
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        notificationPreferences: state.notificationPreferences,
      }),
    }
  )
);

// Selector hooks for better performance
export const useTheme = () => useUIStore(state => state.theme);
export const useSetTheme = () => useUIStore(state => state.setTheme);

export const useNavigation = () => useUIStore(state => ({
  sidebarOpen: state.sidebarOpen,
  mobileMenuOpen: state.mobileMenuOpen,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
  setMobileMenuOpen: state.setMobileMenuOpen,
  toggleMobileMenu: state.toggleMobileMenu,
}));

export const useModal = () => useUIStore(state => ({
  currentModal: state.currentModal,
  modalData: state.modalData,
  openModal: state.openModal,
  closeModal: state.closeModal,
}));

export const useLoading = () => useUIStore(state => ({
  loading: state.loading,
  setLoading: state.setLoading,
  clearLoading: state.clearLoading,
}));

export const useNotificationPreferences = () => useUIStore(state => ({
  preferences: state.notificationPreferences,
  updatePreferences: state.updateNotificationPreferences,
}));