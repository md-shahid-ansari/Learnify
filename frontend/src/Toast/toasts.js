import { toast } from 'react-toastify';

export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};

export const showLoadingToast = (message) => {
    return toast.loading(message, {
        position: "top-center",
        theme: "colored",
    });
};

// Dismiss Toast with valid ID check
export const dismissToast = (toastId) => {
    if (toastId && toast.isActive(toastId)) {
        toast.dismiss(toastId);
    }
};
