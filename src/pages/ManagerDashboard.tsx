import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import DashboardNavBar from '../components/DashboardNavBar';
import LoginForm from '../components/LoginForm';
import FeedbackSummary from '../components/FeedbackSummary';
import FeedbackChart from '../components/FeedbackChart';
import ExportButton from '../components/ExportButton';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { BellIcon, ChartBarIcon, CalendarIcon, ArrowLeftIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

export default function ManagerDashboard({ onBackToFeedback }: { onBackToFeedback: () => void }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeChart, setActiveChart] = useState<'section' | 'date'>('section');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedbacks();
      
      const subscription = supabase
        .channel('feedbacks-channel')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'feedbacks' }, 
          (payload) => {
            setFeedbacks(prev => [...prev, payload.new as Feedback]);
          }
        )
        .subscribe();

      return () => subscription.unsubscribe();
    }
  }, [isAuthenticated]);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFeedbacks(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to load feedback data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-blue-800 text-white py-3 px-4 shadow-md">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <img 
                src="/bank-logo.png" 
                alt="Bank Logo" 
                className="h-8"
              />
              <h1 className="text-lg font-semibold">{t('appTitle')}</h1>
            </div>
            <button
              onClick={onBackToFeedback}
              className="flex items-center gap-2 bg-yellow-500 text-blue-900 px-3 py-1.5 rounded"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('backToFeedback')}
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginForm />
        </main>
      </div>
    );
  }

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (total / feedbacks.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardNavBar />
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 max-w-7xl mt-16 space-y-6">
        {/* Dashboard Header */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
                {t('managerDashboard')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t('lastUpdated')} {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={onBackToFeedback}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm rounded-lg transition-all shadow-sm"
              >
                <CalendarIcon className="h-5 w-5" />
                {t('backToFeedback')}
              </button>
              <ExportButton feedbacks={feedbacks} />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-600">
              <h3 className="text-gray-500 text-sm font-medium">{t('totalFeedback')}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{feedbacks.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-600">
              <h3 className="text-gray-500 text-sm font-medium">{t('averageRating')}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {calculateAverageRating()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-600">
              <h3 className="text-gray-500 text-sm font-medium">{t('latestSubmission')}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {feedbacks[0]?.created_at 
                  ? new Date(feedbacks[0].created_at).toLocaleDateString() 
                  : t('n/a')}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchFeedbacks}
              className="mt-2 bg-red-600 text-white px-3 py-1.5 rounded text-sm"
            >
              {t('retry')}
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-40 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && (
          <>
            {/* Feedback Summary */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  {t('feedbackSummary')}
                </h2>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <BellIcon className="h-4 w-4 animate-pulse text-green-600" />
                  {t('realTimeUpdates')}
                </span>
              </div>
              <FeedbackSummary feedbacks={feedbacks} />
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {activeChart === 'section' ? (
                      <>
                        <ChartBarIcon className="h-5 w-5 text-blue-600" />
                        {t('sectionDistribution')}
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                        {t('dateTrends')}
                      </>
                    )}
                  </h2>
                </div>
                
                <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setActiveChart('section')}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      activeChart === 'section' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    {t('bySection')}
                  </button>
                  <button
                    onClick={() => setActiveChart('date')}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      activeChart === 'date' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {t('byDate')}
                  </button>
                </div>
              </div>
              
              <div className="h-72 sm:h-96">
                <FeedbackChart feedbacks={feedbacks} chartType={activeChart} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}