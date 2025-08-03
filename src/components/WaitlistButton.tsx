import { useState } from 'react';
import WaitlistModal from './WaitlistModal';

interface WaitlistButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function WaitlistButton({ children, className = "" }: WaitlistButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </button>
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
