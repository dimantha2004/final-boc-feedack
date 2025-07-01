import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Database } from '../types/supabase';

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

interface FeedbackSummaryProps {
  feedbacks: Feedback[];
}
const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ feedbacks }) => {
  const { t } = useLanguage();

  // Group feedback by section
  const sectionFeedbacks = feedbacks.reduce((acc, feedback) => {
    const section = feedback.section || t('unknownSection');
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(feedback);
    return acc;
  }, {} as Record<string, Feedback[]>);

  // Calculate summary stats for each section
  const summaryData = Object.entries(sectionFeedbacks).map(([section, items]) => {
    const total = items.length;
    const ratings = items.map(item => item.feedback || 0);
    const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / total;
    const excellent = ratings.filter(r => r === 5).length;
    const good = ratings.filter(r => r === 4).length;
    const neutral = ratings.filter(r => r === 3).length;
    const poor = ratings.filter(r => r === 2).length;
    const veryPoor = ratings.filter(r => r === 1).length;
    
    return {
      section,
      total,
      avgRating: avgRating.toFixed(1),
      excellent,
      good,
      neutral,
      poor,
      veryPoor
    };
  }).sort((a, b) => b.total - a.total);

  // Render a responsive card for each section on small screens
  const renderMobileCards = () => {
    return summaryData.map((data, index) => (
      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="font-medium text-lg mb-2 text-gray-800">{data.section}</div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="text-xs text-gray-500 block">{t('totalFeedback')}</span>
            <span className="text-lg font-bold">{data.total}</span>
          </div>
          
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="text-xs text-gray-500 block">{t('avgRating')}</span>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-1">{data.avgRating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} 
                    className={`w-3 h-3 ${parseFloat(data.avgRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 bg-white p-3 rounded shadow-sm">
          <span className="text-xs text-gray-500 block mb-2">{t('ratingDistribution')}</span>
          <div className="grid grid-cols-5 gap-1 text-center">
            <div>
              <div className="h-12 flex items-end justify-center">
                <div 
                  className="w-5 bg-red-500 rounded-t"
                  style={{ height: `${(data.veryPoor / data.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 block">{t('veryPoor')}</span>
              <span className="text-xs font-medium">{data.veryPoor}</span>
            </div>
            <div>
              <div className="h-12 flex items-end justify-center">
                <div 
                  className="w-5 bg-orange-500 rounded-t"
                  style={{ height: `${(data.poor / data.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 block">{t('poor')}</span>
              <span className="text-xs font-medium">{data.poor}</span>
            </div>
            <div>
              <div className="h-12 flex items-end justify-center">
                <div 
                  className="w-5 bg-gray-400 rounded-t"
                  style={{ height: `${(data.neutral / data.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 block">{t('neutral')}</span>
              <span className="text-xs font-medium">{data.neutral}</span>
            </div>
            <div>
              <div className="h-12 flex items-end justify-center">
                <div 
                  className="w-5 bg-blue-400 rounded-t"
                  style={{ height: `${(data.good / data.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 block">{t('good')}</span>
              <span className="text-xs font-medium">{data.good}</span>
            </div>
            <div>
              <div className="h-12 flex items-end justify-center">
                <div 
                  className="w-5 bg-green-500 rounded-t"
                  style={{ height: `${(data.excellent / data.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 block">{t('excellent')}</span>
              <span className="text-xs font-medium">{data.excellent}</span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Render traditional table for larger screens
  const renderDesktopTable = () => {
    return (
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('section')}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('totalFeedback')}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('avgRating')}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('excellent')} (5)
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('good')} (4)
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('neutral')} (3)
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('poor')} (2)
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('veryPoor')} (1)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {summaryData.map((data, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                {data.section}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center font-medium">
                {data.total}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  <span className="font-medium mr-1">{data.avgRating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} 
                        className={`w-3 h-3 ${parseFloat(data.avgRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {data.excellent}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {data.good}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {data.neutral}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {data.poor}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  {data.veryPoor}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {/* Desktop table (hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto">
        {renderDesktopTable()}
      </div>
      
      {/* Mobile card view (visible only on small screens) */}
      <div className="md:hidden">
        {summaryData.length > 0 ? (
          renderMobileCards()
        ) : (
          <p className="text-gray-500 italic text-center py-8">{t('noFeedbackData')}</p>
        )}
      </div>
      
      {summaryData.length === 0 && (
        <p className="text-gray-500 italic text-center py-8">{t('noFeedbackData')}</p>
      )}
    </div>
  );
};

export default FeedbackSummary;