import { useState, useEffect, type FormEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'standard' | 'halo';
}

export default function WaitlistModal({ isOpen, onClose, variant = 'standard' }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage("Thanks for joining! Check your email for confirmation.");
        setEmail("");
        setTimeout(() => {
          handleClose();
          setIsSuccess(false);
          setMessage("");
        }, 2000);
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const isHalo = variant === 'halo';

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] shadow-2xl transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      {isHalo && (
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 60%)'
          }}
        />
      )}
      <div
        className={`${isHalo ? 'bg-black shadow-[0_0_80px_rgba(255,255,255,0.3)]' : 'bg-white dark:bg-neutral-900'} rounded-2xl p-8 max-w-md w-full mx-4 relative transition-all duration-500 ease-out ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 ${isHalo ? 'text-white/50 hover:text-white' : 'dark:text-white text-black hover:text-gray-500'} transition ease-in-out duration-500 text-xl leading-none`}
        >
          ×
        </button>
        <div className="text-center space-y-6">
          <div className={`text-3xl font-serif ${isHalo ? 'text-white' : ''}`}>Join the Waitlist</div>
          <div className={`font-satoshi text-sm ${isHalo ? 'text-white/70' : ''}`}>
            Be first in line when Halo drops because personal safety shouldn't
            be a luxury.
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-2 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-300 ${
                isHalo 
                ? 'bg-white/10 text-white placeholder-white/40 border-none px-4 py-3 text-center' 
                : 'border border-gray-300 text-black focus:ring-black'
              }`}
              required
              disabled={isLoading}
            />
            {message && (
              <div
                className={`text-sm text-center ${isSuccess ? "text-green-600" : "text-red-500"}`}
              >
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-sm rounded-xl transition-all ease-in-out duration-500 disabled:opacity-50 font-serif font-semibold flex items-center justify-center gap-2 ${
                isHalo 
                ? 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-95' 
                : 'bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 py-2 rounded-md'
              }`}
            >
              {isLoading ? "Joining..." : (
                <>
                  Join the Waitlist
                  <span className="font-sans font-medium text-lg leading-none transform translate-y-[-1px]">&rarr;</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
