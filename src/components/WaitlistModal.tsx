import { useState, useEffect } from "react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-xs flex md:items-center md:justify-center items-end z-50 shadow-2xl transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white md:rounded-lg rounded-t-2xl p-8 max-w-md w-full mx-0 md:mx-4 relative transition-all duration-300 ${
        isVisible ? 'opacity-100 md:scale-100 translate-y-0' : 'opacity-0 md:scale-95 translate-y-full'
      }`}>
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-black hover:text-gray-500 transition ease-in-out duration-500 text-xl leading-none"
        >
          ×
        </button>
        <div className="text-center space-y-6">
          <div className="text-3xl font-serif">Join the Waitlist</div>
          <div className="font-satoshi text-sm">
            Be first in line when Halo drops because personal safety shouldn't
            be a luxury.
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
              disabled={isLoading}
            />
            {message && (
              <div className={`text-sm text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 text-sm rounded-md hover:bg-black/80 transition-colors ease-in-out duration-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Joining...' : 'Join the Waitlist >'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
