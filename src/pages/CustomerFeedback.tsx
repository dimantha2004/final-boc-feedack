import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import SectionSelector from '../components/SectionSelector';
import StarRating from '../components/StarRating';
import ThankYouMessage from '../components/ThankYouMessage';
import { supabase } from '../lib/supabase';

export default function CustomerFeedback({ onShowDashboard }: { onShowDashboard: () => void }) {
  const [step, setStep] = useState<'section' | 'rating'>('section');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showThankYou, setShowThankYou] = useState(false);
  const { t } = useLanguage();

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    setStep('rating');
  };

  const handleRatingSelect = async (rating: number) => {
    try {
      // Insert feedback into Supabase
      await supabase.from('feedbacks').insert({
        section: selectedSection,
        feedback: rating
      });

      // Show thank you message
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const resetForm = () => {
    setShowThankYou(false);
    setStep('section');
    setSelectedSection('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4 px-6 shadow-md relative">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <img 
              src="https://w7.pngwing.com/pngs/47/201/png-transparent-atm-bank-of-ceylon-money-dfcc-bank-bank-text-logo-sign.png" 
              alt="Bank of Ceylon" 
              className="h-10"
            />
            <h1 className="ml-3 text-xl font-semibold hidden md:block">{t('appTitle')}</h1>
          </div>
          
       
        </div>
        
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          {step === 'section' && <SectionSelector onSectionSelect={handleSectionSelect} />}
          {step === 'rating' && <StarRating onRatingSelect={handleRatingSelect} />}
        </div>
      </main>

      <button
            onClick={onShowDashboard}
            className="p-2 text-sm bg-yellow-500 text-blue-900 rounded hidden md:block"
          >
            {t('dashboard')}
          </button>  

      {/* Thank You Modal */}
      {showThankYou && <ThankYouMessage onDismiss={resetForm} />}

      {/* Mobile Dashboard Button */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={onShowDashboard}
          className="p-3 bg-yellow-500 text-blue-900 rounded-full shadow-lg"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>
    </div>
  );
}