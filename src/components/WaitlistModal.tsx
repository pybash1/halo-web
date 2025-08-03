import { useState, useEffect } from "react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Email submitted:", email);
    // You can add your waitlist logic here
    onClose();
    setEmail("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 shadow-2xl"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
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
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 text-sm rounded-md hover:bg-black/80 transition-colors ease-in-out duration-500 cursor-pointer"
            >
              Join the Waitlist &gt;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
