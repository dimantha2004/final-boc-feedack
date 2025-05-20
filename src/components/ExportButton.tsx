import React from 'react';
import { Database } from '../types/supabase';

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

interface ExportButtonProps {
  feedbacks: Feedback[];
}

export default function ExportButton({ feedbacks }: ExportButtonProps) {
  const exportToCSV = () => {
    if (feedbacks.length === 0) {
      alert('No data to export');
      return;
    }

    // Convert the feedbacks to CSV format
    const headers = ['Section', 'Rating', 'Date'];
    
    const rows = feedbacks.map(feedback => {
      const date = new Date(feedback.created_at).toLocaleDateString();
      const section = feedback.section
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      return [section, feedback.feedback.toString(), date];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `boc-feedback-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export as CSV
    </button>
  );
}