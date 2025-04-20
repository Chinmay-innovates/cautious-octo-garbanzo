import { toast } from 'sonner';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const useCustomToast = () => {
  const success = (title: string, options?: ToastOptions) =>
    toast.success(title, {
      icon: <CheckCircle className="text-green-500" />,
      description: options?.description,
      duration: options?.duration ?? 4000,
    });

  const error = (title: string, options?: ToastOptions) =>
    toast.error(title, {
      icon: <XCircle className="text-red-500" />,
      description: options?.description,
      duration: options?.duration ?? 5000,
    });

  const info = (title: string, options?: ToastOptions) =>
    toast(title, {
      icon: <Info className="text-blue-500" />,
      description: options?.description,
      duration: options?.duration ?? 4000,
    });

  const warning = (title: string, options?: ToastOptions) =>
    toast(title, {
      icon: <AlertTriangle className="text-yellow-500" />,
      description: options?.description,
      duration: options?.duration ?? 4000,
    });

  return { success, error, info, warning };
};
