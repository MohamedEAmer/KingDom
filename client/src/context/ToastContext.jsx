import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      {toast.message && (
        <div
          className={`
            fixed left-1/2 top-30 -translate-x-1/2
            px-5 py-3 rounded-xl shadow-2xl text-white text-sm z-[9999]
            backdrop-blur-md border border-white/10
            animate-fadeSlide
            ${
              toast.type === "success"
                ? "bg-green-600/80"
                : toast.type === "error"
                ? "bg-red-600/80"
                : "bg-yellow-600/80" // warning / alert color
            }
          `}
        >
          <div className="flex items-center gap-2">
            {/* Icon */}
            {toast.type === "success" ? (
              <span className="text-white text-lg">✔️</span>
            ) : toast.type === "error" ? (
              <span className="text-white text-lg">❌</span>
            ) : (
              <span className="text-white text-lg">⚠️</span> // warning icon
            )}

            {/* Message */}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
