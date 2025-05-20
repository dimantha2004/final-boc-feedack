import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, Globe, LogOut, ChevronDown } from 'lucide-react';

export default function DashboardNavBar() {
  const { logout } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'සිංහල' },
    { code: 'ta', name: 'தமிழ்' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-blue-900 shadow-lg py-2' : 'bg-blue-800 py-4'
    } text-white px-4 md:px-6`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <div className="relative overflow-hidden">
            <img
              src="https://w7.pngwing.com/pngs/47/201/png-transparent-atm-bank-of-ceylon-money-dfcc-bank-bank-text-logo-sign.png"
              alt="Bank of Ceylon"
              className="h-8 md:h-10 transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-shimmer" />
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-lg md:text-xl font-bold tracking-wide text-yellow-400">
              BOC
            </span>
            <span className="text-xs md:text-sm font-medium hidden md:inline text-blue-100">
              {t('dashboard')}
            </span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="flex items-center space-x-2 text-blue-100 hover:text-yellow-400 transition-colors"
            >
              <Globe size={18} />
              <span>{languages.find(lang => lang.code === currentLanguage)?.name || 'Language'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${languageMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {languageMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 animate-fadeIn">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === lang.code 
                        ? 'bg-blue-50 text-blue-800 font-medium' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-4 py-2 rounded-md transition-all duration-200 hover:shadow-md"
          >
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-3 animate-slideDown">
          <div className="flex flex-col space-y-3 border-t border-blue-700 pt-3 px-2">
            {/* Mobile Language Selector */}
            <div className="border-b border-blue-700 pb-3">
              <p className="text-xs text-blue-200 mb-2">{t('selectLanguage')}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                    }}
                    className={`px-3 py-1 text-sm rounded-full ${
                      currentLanguage === lang.code 
                        ? 'bg-yellow-500 text-blue-900 font-medium' 
                        : 'bg-blue-700 text-white hover:bg-blue-600'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile Logout Button */}
            <button
              onClick={logout}
              className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-4 py-2 rounded-md transition-colors w-full"
            >
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}