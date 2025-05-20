import React from 'react';
import { sections } from '../utils/languageData';
import { useLanguage } from '../contexts/LanguageContext';

interface SectionSelectorProps {
  onSectionSelect: (section: string) => void;
}

export default function SectionSelector({ onSectionSelect }: SectionSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold mb-6 text-center">{t('selectSection')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => onSectionSelect(section)}
            className="p-4 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-center font-medium flex items-center justify-center min-h-16"
          >
            {t(`sections.${section}`)}
          </button>
        ))}
      </div>
    </div>
  );
}