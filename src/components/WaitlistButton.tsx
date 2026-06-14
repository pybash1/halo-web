import { useState, type ReactNode } from 'react';
import WaitlistModal from './WaitlistModal';

interface WaitlistButtonProps {
  children: ReactNode;
  className?: string;
  isHeroButton?: boolean;
}

export default function WaitlistButton({ children, className = "", isHeroButton = false }: WaitlistButtonProps) {
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
        variant="halo"
      />
    </>
  );
}
