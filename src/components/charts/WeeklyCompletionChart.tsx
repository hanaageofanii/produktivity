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
  ArcElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function WeeklyCompletionChart() {
  const [completionData, setCompletionData] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    // Calculate completion rate from all tasks
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const houseworks = JSON.parse(localStorage.getItem('houseworks') || '[]');

    const allTasks = [...todos, ...plans, ...houseworks];
    const completed = allTasks.filter(task => task.completed).length;
    const total = allTasks.length;

    setCompletionData({ completed, total });
  }, []);

  const completionRate = completionData.total > 0 ? (completionData.completed / completionData.total) * 100 : 0;

  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completionRate, 100 - completionRate],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(229, 231, 235, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(229, 231, 235)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed.toFixed(1) + '%';
          }
        }
      }
    },
  };

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="relative w-full h-48">
        <Doughnut data={data} options={options} />
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {completionData.completed} of {completionData.total} tasks completed
        </p>
        <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
      </div>
    </div>
  );
}