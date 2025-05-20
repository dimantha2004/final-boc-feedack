import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Database } from '../types/supabase';

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

interface FeedbackSummaryProps {
  feedbacks: Feedback[];
}

export default function FeedbackSummary({ feedbacks }: FeedbackSummaryProps) {
  const { t } = useLanguage();

  const getSectionSummary = () => {
    const sections: Record<string, { poor: number; good: number; excellent: number; total: number }> = {};
    
    feedbacks.forEach((feedback) => {
      if (!sections[feedback.section]) {
        sections[feedback.section] = { poor: 0, good: 0, excellent: 0, total: 0 };
      }
      
      if (feedback.feedback <= 2) {
        sections[feedback.section].poor++;
      } else if (feedback.feedback <= 4) {
        sections[feedback.section].good++;
      } else {
        sections[feedback.section].excellent++;
      }
      
      sections[feedback.section].total++;
    });
    
    return sections;
  };

  const sectionSummary = getSectionSummary();
  
  // Calculate totals
  const totals = {
    poor: 0,
    good: 0,
    excellent: 0,
    total: 0
  };
  
  Object.values(sectionSummary).forEach((section) => {
    totals.poor += section.poor;
    totals.good += section.good;
    totals.excellent += section.excellent;
    totals.total += section.total;
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Section
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('poor')} (1-2)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('good')} (3-4)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t('excellent')} (5-6)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(sectionSummary).map(([section, counts]) => (
            <tr key={section} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {t(`sections.${section}`)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {counts.poor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {counts.good}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {counts.excellent}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {counts.total}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {totals.poor}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {totals.good}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {totals.excellent}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {totals.total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}