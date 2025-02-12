import toast from 'react-hot-toast';

class ToastService {
  success(message: string) {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
  }

  error(message: string) {
    toast.error(message, {
      duration: 5000,
      position: 'bottom-right',
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    });
  }

  info(message: string) {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
    });
  }
}

export const toastService = new ToastService();