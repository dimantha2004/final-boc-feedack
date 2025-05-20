import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/languageData';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            language === 'english' 
              ? 'bg-blue-800 text-white' 
              : 'bg-white text-blue-800 border border-blue-800'
          }`}
          onClick={() => setLanguage('english')}
        >
          English
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            language === 'sinhala' 
              ? 'bg-blue-800 text-white' 
              : 'bg-white text-blue-800 border border-blue-800'
          }`}
          onClick={() => setLanguage('sinhala')}
        >
          සිංහල
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            language === 'tamil' 
              ? 'bg-blue-800 text-white' 
              : 'bg-white text-blue-800 border border-blue-800'
          }`}
          onClick={() => setLanguage('tamil')}
        >
          தமிழ்
        </button>
      </div>
    </div>
  );
}