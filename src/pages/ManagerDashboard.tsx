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
import { 
  BellIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  ArrowLeftIcon, 
  DocumentChartBarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

export default function ManagerDashboard({ onBackToFeedback }: { onBackToFeedback: () => void }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeChart, setActiveChart] = useState<'section' | 'date'>('section');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'all' | 'week' | 'month'>('all');
  const [feedbackTrends, setFeedbackTrends] = useState({ positive: 0, negative: 0, neutral: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedbacks();
      
      const subscription = supabase
        .channel('feedbacks-channel')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'feedbacks' }, 
          (payload) => {
            setFeedbacks(prev => {
              const updatedFeedbacks = [...prev, payload.new as Feedback];
              calculateFeedbackTrends(updatedFeedbacks);
              return updatedFeedbacks;
            });
          }
        )
        .subscribe();

      return () => subscription.unsubscribe();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (feedbacks.length > 0) {
      calculateFeedbackTrends(feedbacks);
    }
  }, [feedbacks, timePeriod]);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFeedbacks(data || []);
      calculateFeedbackTrends(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError(t('failedFeedbackLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFeedbackTrends = (data: Feedback[]) => {
    const filteredData = filterDataByTimePeriod(data);
    const positive = filteredData.filter(item => (item.feedback || 0) >= 4).length;
    const negative = filteredData.filter(item => (item.feedback || 0) <= 2).length;
    const neutral = filteredData.filter(item => (item.feedback || 0) === 3).length;
    setFeedbackTrends({ positive, negative, neutral });
  };

  const filterDataByTimePeriod = (data: Feedback[]) => {
    const now = new Date();
    switch (timePeriod) {
      case 'week':
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        return data.filter(item => new Date(item.created_at) >= oneWeekAgo);
      case 'month':
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return data.filter(item => new Date(item.created_at) >= oneMonthAgo);
      default:
        return data;
    }
  };

  const getSectionPerformance = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return feedbacks
      .filter(fb => new Date(fb.created_at) >= today)
      .reduce((acc, curr) => {
        const section = curr.section || t('unknownSection');
        if (!acc[section]) {
          acc[section] = { poor: 0, neutral: 0, positive: 0 };
        }
        const rating = curr.feedback || 0;
        if (rating <= 2) acc[section].poor++;
        else if (rating === 3) acc[section].neutral++;
        else acc[section].positive++;
        return acc;
      }, {} as Record<string, { poor: number, neutral: number, positive: number }>);
  };

  const getTopSections = () => {
    const sectionCounts = feedbacks.reduce((acc, curr) => {
      const section = curr.section || t('unknownSection');
      acc[section] = (acc[section] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(sectionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardNavBar />
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 max-w-7xl mt-16 space-y-6">
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
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button 
                  onClick={() => setTimePeriod('all')}
                  className={`px-3 py-1.5 text-sm ${timePeriod === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  {t('allTime')}
                </button>
                <button 
                  onClick={() => setTimePeriod('month')}
                  className={`px-3 py-1.5 text-sm ${timePeriod === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  {t('thisMonth')}
                </button>
                <button 
                  onClick={() => setTimePeriod('week')}
                  className={`px-3 py-1.5 text-sm ${timePeriod === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  {t('thisWeek')}
                </button>
              </div>
              
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

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-600">
              <h3 className="text-gray-500 text-sm font-medium">{t('totalFeedback')}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{feedbacks.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">{t('sentimentDistribution')}</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {timePeriod === 'all' ? t('allTime') : 
                   timePeriod === 'month' ? t('thisMonth') : t('thisWeek')}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <FaceSmileIcon className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">{feedbackTrends.positive}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-300 rounded-full"></span>
                  <span className="font-semibold">{feedbackTrends.neutral}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaceFrownIcon className="h-5 w-5 text-red-500" />
                  <span className="font-semibold">{feedbackTrends.negative}</span>
                </div>
              </div>
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

        {isLoading && (
          <div className="flex justify-center items-center h-40 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  {t('topSections')}
                </h2>
                <div className="space-y-3">
                  {getTopSections().map(([section, count], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 truncate max-w-xs">{section}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 h-2 rounded-full w-24 sm:w-32 md:w-48">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / feedbacks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                  {t('todaysPerformance')}
                </h2>
                <div className="space-y-3">
                  {Object.entries(getSectionPerformance()).map(([section, counts]) => (
                    <div key={section} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{section}</span>
                        <span className="text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-red-50 p-2 rounded">
                          <span className="text-red-600 font-semibold block">{counts.poor}</span>
                          <span className="text-xs text-gray-500">{t('poor')}</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600 font-semibold block">{counts.neutral}</span>
                          <span className="text-xs text-gray-500">{t('neutral')}</span>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <span className="text-green-600 font-semibold block">{counts.positive}</span>
                          <span className="text-xs text-gray-500">{t('positive')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {Object.keys(getSectionPerformance()).length === 0 && (
                    <p className="text-gray-500 text-sm italic">{t('noFeedbackToday')}</p>
                  )}
                </div>
              </div>
            </div>

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
              <div className="overflow-x-auto -mx-4 px-4">
                <FeedbackSummary feedbacks={feedbacks} />
              </div>
            </div>

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