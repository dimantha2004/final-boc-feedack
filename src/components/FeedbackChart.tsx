import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Database } from '../types/supabase';

type Feedback = Database['public']['Tables']['feedbacks']['Row'];

interface FeedbackChartProps {
  feedbacks: Feedback[];
  chartType: 'section' | 'date';
}

export default function FeedbackChart({ feedbacks, chartType }: FeedbackChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || feedbacks.length === 0) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartType === 'section') {
      createSectionChart(ctx);
    } else {
      createDateChart(ctx);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [feedbacks, chartType]);

  const createSectionChart = (ctx: CanvasRenderingContext2D) => {
    // Group feedbacks by section and rating category
    const sectionData: Record<string, { poor: number; good: number; excellent: number }> = {};

    feedbacks.forEach((feedback) => {
      if (!sectionData[feedback.section]) {
        sectionData[feedback.section] = { poor: 0, good: 0, excellent: 0 };
      }

      if (feedback.feedback <= 2) {
        sectionData[feedback.section].poor++;
      } else if (feedback.feedback <= 4) {
        sectionData[feedback.section].good++;
      } else {
        sectionData[feedback.section].excellent++;
      }
    });

    const sections = Object.keys(sectionData);
    const poorData = sections.map(section => sectionData[section].poor);
    const goodData = sections.map(section => sectionData[section].good);
    const excellentData = sections.map(section => sectionData[section].excellent);

    // Format section names for display
    const formattedSections = sections.map(section => {
      return section
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    });

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: formattedSections,
        datasets: [
          {
            label: 'Poor (1-2)',
            data: poorData,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1
          },
          {
            label: 'Good (3-4)',
            data: goodData,
            backgroundColor: 'rgba(234, 179, 8, 0.7)',
            borderColor: 'rgb(234, 179, 8)',
            borderWidth: 1
          },
          {
            label: 'Excellent (5-6)',
            data: excellentData,
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Feedback by Section'
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  };

  const createDateChart = (ctx: CanvasRenderingContext2D) => {
    // Group feedbacks by date
    const dateData: Record<string, { total: number; average: number }> = {};

    feedbacks.forEach((feedback) => {
      const date = new Date(feedback.created_at).toLocaleDateString();
      
      if (!dateData[date]) {
        dateData[date] = { total: 0, average: 0 };
      }

      dateData[date].total++;
      dateData[date].average = (dateData[date].average * (dateData[date].total - 1) + feedback.feedback) / dateData[date].total;
    });

    const dates = Object.keys(dateData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const totalData = dates.map(date => dateData[date].total);
    const averageData = dates.map(date => parseFloat(dateData[date].average.toFixed(2)));

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Total Feedback',
            data: totalData,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Average Rating',
            data: averageData,
            backgroundColor: 'rgba(245, 158, 11, 0.5)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Feedback Trends by Date'
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Total Feedbacks'
            },
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Average Rating'
            },
            min: 0,
            max: 6,
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}