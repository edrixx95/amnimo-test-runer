export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  id?: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export interface Toast extends ToastOptions {
  id: string;
}

export const useToast = () => {
  const toasts = useState<Toast[]>('app-toasts', () => []);

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const addToast = (options: ToastOptions) => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    const duration = options.duration ?? 4000;
    
    const toast: Toast = {
      ...options,
      id,
      type: options.type || 'info'
    };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  return {
    toasts,
    addToast,
    removeToast
  };
};
