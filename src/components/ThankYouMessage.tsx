import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ThankYouMessageProps {
  onDismiss: () => void;
}

export default function ThankYouMessage({ onDismiss }: ThankYouMessageProps) {
  const { t } = useLanguage();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4 animate-slide-up">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-blue-800 mb-2">{t('thankYou')}</h2>
      </div>
    </div>
  );
}