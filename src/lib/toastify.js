import toast from 'react-hot-toast';

class ToastService {
  #activeToastId = null;

  static TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading',
    DEFAULT: 'default',
  };

  static DEFAULT_OPTIONS = {
    position: 'top-center',
    duration: 5000,
  };

  #getToastHandler(type) {
    const handlers = {
      [ToastService.TOAST_TYPES.SUCCESS]: toast.success,
      [ToastService.TOAST_TYPES.ERROR]: toast.error,
      [ToastService.TOAST_TYPES.LOADING]: toast.loading,
      [ToastService.TOAST_TYPES.DEFAULT]: toast,
    };

    return handlers[type] ?? toast;
  }

  #dismissActive() {
    if (this.#activeToastId) {
      toast.dismiss(this.#activeToastId);
      this.#activeToastId = null;
    }
  }

  show(message, type = ToastService.TOAST_TYPES.DEFAULT, options = {}) {
    if (!message) {
      return null;
    }

    this.#dismissActive();

    const handler = this.#getToastHandler(type);
    const mergedOptions = { ...ToastService.DEFAULT_OPTIONS, ...options };

    this.#activeToastId = handler(message, mergedOptions);
    return this.#activeToastId;
  }

  success(message, options) {
    return this.show(message, ToastService.TOAST_TYPES.SUCCESS, options);
  }

  error(message, options) {
    return this.show(message, ToastService.TOAST_TYPES.ERROR, options);
  }

  loading(message, options) {
    return this.show(message, ToastService.TOAST_TYPES.LOADING, options);
  }

  info(message, options) {
    return this.show(message, ToastService.TOAST_TYPES.DEFAULT, options);
  }

  dismiss(toastId) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      this.#dismissActive();
    }
  }

  dismissAll() {
    toast.dismiss();
    this.#activeToastId = null;
  }

  promise(promise, messages, options) {
    this.#dismissActive();

    const toastId = toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      { ...ToastService.DEFAULT_OPTIONS, ...options }
    );

    this.#activeToastId = toastId;
    return toastId;
  }
}

export const Toast = new ToastService();
export default Toast;