import { create } from 'zustand';

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    open: boolean;
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
    hideToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
    message: '',
    type: 'info',
    open: false,
    showToast: (message, type) => set({ message, type, open: true }),
    hideToast: () => set({ open: false })
}));