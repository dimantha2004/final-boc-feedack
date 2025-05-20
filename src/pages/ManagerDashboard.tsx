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

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

export default function ManagerDashboard({ onBackToFeedback }: { onBackToFeedback: () => void }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeChart, setActiveChart] = useState<'section' | 'date'>('section');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedbacks();
      
      // Set up real-time subscription
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
      
      return () => {
        subscription.unsubscribe();
      };
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
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
            
            <button
              onClick={onBackToFeedback}
              className="p-2 bg-yellow-500 text-blue-900 rounded"
            >
              Back to Feedback
            </button>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center p-6">
          <LoginForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardNavBar />
      
      <div className="flex-1 container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('dashboard')}</h1>
            <p className="text-gray-600">
              {feedbacks.length} total feedback submissions
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onBackToFeedback}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Back to Feedback
            </button>
            
            <ExportButton feedbacks={feedbacks} />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">{t('feedbackSummary')}</h2>
              <FeedbackSummary feedbacks={feedbacks} />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t(activeChart === 'section' ? 'feedbackSummary' : 'dateWiseTrends')}</h2>
                
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setActiveChart('section')}
                    className={`px-4 py-2 ${
                      activeChart === 'section' 
                        ? 'bg-blue-800 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    By Section
                  </button>
                  <button
                    onClick={() => setActiveChart('date')}
                    className={`px-4 py-2 ${
                      activeChart === 'date' 
                        ? 'bg-blue-800 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    By Date
                  </button>
                </div>
              </div>
              
              <div className="h-80">
                <FeedbackChart feedbacks={feedbacks} chartType={activeChart} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}