import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';


interface StarRatingProps {
  onRatingSelect: (rating: number) => void;
}

export default function StarRating({ onRatingSelect }: StarRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { t, language } = useLanguage();

  const handleRatingClick = (value: number) => {
    setRating(value);
  };
  
  const handleSubmit = () => {
    if (rating > 0) {
      onRatingSelect(rating);
      setIsSubmitted(true);
      
      // Trigger celebration animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const activeRating = hoveredRating || rating;

  // Calculate label opacity based on rating
  const getLabelOpacity = (type: 'poor' | 'good' | 'excellent') => {
    if (!activeRating) return 0.5;
    
    if (type === 'poor' && activeRating <= 2) return 1;
    if (type === 'good' && activeRating >= 3 && activeRating <= 4) return 1;
    if (type === 'excellent' && activeRating >= 5) return 1;
    
    return 0.5;
  };
  
  // Get star color based on position and active rating
  const getStarColor = (position: number) => {
    if (position > activeRating) return 'none';
    
    if (position <= 2) return '#FF5252';  // Red for low ratings
    if (position <= 4) return '#FFC107';  // Yellow for medium ratings
    return '#4CAF50';  // Green for high ratings
  };
  
  // Get stroke color for stars
  const getStarStroke = (position: number) => {
    if (position > activeRating) return '#CBD5E1';
    
    if (position <= 2) return '#FF5252';
    if (position <= 4) return '#FFC107';
    return '#4CAF50';
  };

  return (
    <div className="flex flex-col items-center relative">
      {isSubmitted ? (
        // Thank you message after submission
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="mb-6 text-center">
            <svg width="80" height="80" viewBox="0 0 24 24" className="mx-auto mb-4 text-green-500">
              <circle cx="12" cy="12" r="10" fill="#4CAF50" />
              <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xl font-semibold text-center text-gray-800">{t('thankYou')}</p>
            <p className="text-base text-gray-600 mt-2">{t('feedbackSubmitted')}</p>
            <div className="mt-4 flex justify-center">
              {[...Array(rating)].map((_, i) => (
                <svg
                  key={i}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={getStarColor(i + 1)}
                  stroke={getStarStroke(i + 1)}
                  strokeWidth="2"
                  className="mx-1"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Rating selection UI
        <>
          <p className="text-xl font-semibold mb-6 text-center">{t('rateService')}</p>
          
          {/* Celebration particles animation when rating is selected */}
          {isAnimating && (
            <div className="absolute -inset-4 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-float rounded-full"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    backgroundColor: getStarColor(rating),
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `float ${Math.random() * 2 + 1}s ease-out forwards`
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="flex flex-col items-center">
            
            {/* Stars Row */}
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5, 6].map((star) => (
                <button
                  key={star}
                  className="focus:outline-none group relative"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(star)}
                >
                  {/* Pulse animation for hovered/selected stars */}
                  {star <= activeRating && (
                    <span className="absolute inset-0 animate-ping rounded-full opacity-30" 
                          style={{ backgroundColor: getStarColor(star) }} />
                  )}
                  
                  {/* Star SVG with enhanced transitions */}
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill={getStarColor(star)}
                    stroke={getStarStroke(star)}
                    strokeWidth="2"
                    className={`transition-all duration-300 ease-in-out 
                              ${star <= activeRating ? 'transform scale-110' : 'transform scale-100'}
                              ${star <= hoveredRating ? 'animate-wiggle' : ''}
                              group-hover:rotate-12`}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    
                    {/* Inner glow for selected stars */}
                    {star <= activeRating && (
                      <polygon 
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
                        fill="url(#starGlow)" 
                        opacity="0.6"
                      />
                    )}
                  </svg>
                  
                  {/* Number indicator that appears when hovering */}
                  <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                              transition-all duration-200 ${hoveredRating === star ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-800 text-white">{star}</span>
                  </div>
                </button>
              ))}
              
              {/* SVG definitions for special effects */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <radialGradient id="starGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Labels Row with smooth transitions - MOVED UP TO BE UNDER STARS */}
            <div className="flex justify-between w-full px-4 mt-2 mb-6">
              <div className="w-1/3 text-center transition-opacity duration-300" style={{ opacity: getLabelOpacity('poor') }}>
                <span className="text-sm font-medium text-red-600">{t('poor')}</span>
              </div>
              <div className="w-1/3 text-center transition-opacity duration-300" style={{ opacity: getLabelOpacity('good') }}>
                <span className="text-sm font-medium text-yellow-600">{t('good')}</span>
              </div>
              <div className="w-1/3 text-center transition-opacity duration-300" style={{ opacity: getLabelOpacity('excellent') }}>
                <span className="text-sm font-medium text-green-600">{t('excellent')}</span>
              </div>
            </div>

            {/* Submit button - MOVED TO THE BOTTOM */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`mt-2 px-6 py-2 rounded-full font-semibold text-white shadow-lg transform transition-all duration-300
                          ${rating > 0 
                            ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer' 
                            : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
              key={`submit-button-${language}`} // Add key to force re-render when language changes
            >
              {t('submit')}
            </button>
          </div>
        </>
      )}
      
      {/* Add this CSS to your global stylesheet */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes wiggle {
          0% { transform: rotate(0deg) scale(1.1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(5deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1.1); }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}