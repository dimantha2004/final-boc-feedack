import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface StarRatingProps {
  onRatingSelect: (rating: number) => void;
}

export default function StarRating({ onRatingSelect }: StarRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const { t } = useLanguage();

  const handleRatingClick = (value: number) => {
    setRating(value);
    onRatingSelect(value);
  };

  const getFeedbackLabel = (value: number) => {
    if (value <= 0) return '';
    if (value <= 2) return t('poor');
    if (value <= 4) return t('good');
    return t('excellent');
  };

  const activeRating = hoveredRating || rating;
  const feedbackLabel = getFeedbackLabel(activeRating);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold mb-6 text-center">{t('rateService')}</p>
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5, 6].map((star) => (
          <button
            key={star}
            className="focus:outline-none transform transition-transform hover:scale-110"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRatingClick(star)}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill={star <= activeRating ? '#FFD700' : 'none'}
              stroke={star <= activeRating ? '#FFD700' : '#CBD5E1'}
              strokeWidth="2"
              className="transition-colors duration-200"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>
      {feedbackLabel && (
        <div className={`text-lg font-medium ${
          activeRating <= 2 ? 'text-red-600' :
          activeRating <= 4 ? 'text-yellow-600' :
          'text-green-600'
        } transition-colors duration-200`}>
          {feedbackLabel}
        </div>
      )}
    </div>
  );
}