import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodTrackerChart() {
  const [moodData, setMoodData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const healthMoods = JSON.parse(localStorage.getItem('health-mood') || '[]');
    
    // Get last 7 days
    const last7Days = [];
    const moodValues = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      last7Days.push(format(subDays(new Date(), i), 'MMM dd'));
      
      const dayMood = healthMoods.find((hm: any) => hm.date === date);
      moodValues.push(dayMood ? dayMood.mood : 0);
    }

    setLabels(last7Days);
    setMoodData(moodValues);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood (1-10)',
        data: moodData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const mood = context.parsed.y;
            if (mood >= 8) return '😊 Great mood!';
            if (mood >= 6) return '😐 Okay mood';
            if (mood >= 4) return '😕 Low mood';
            if (mood > 0) return '😢 Poor mood';
            return 'No data';
          }
        }
      }
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}