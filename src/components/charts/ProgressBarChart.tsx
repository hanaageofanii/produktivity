import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressBarChart() {
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([]);

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const developments = JSON.parse(localStorage.getItem('developments') || '[]');
    
    const progress = [];
    
    // Get last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7));
      const weekEnd = endOfWeek(subDays(new Date(), i * 7));
      
      const weekTodos = todos.filter((todo: any) => {
        const todoDate = new Date(todo.createdAt || todo.date);
        return isWithinInterval(todoDate, { start: weekStart, end: weekEnd });
      });
      
      const weekPlans = plans.filter((plan: any) => {
        const planDate = new Date(plan.createdAt || plan.date);
        return isWithinInterval(planDate, { start: weekStart, end: weekEnd });
      });
      
      const weekDevelopments = developments.filter((dev: any) => {
        const devDate = new Date(dev.createdAt || dev.date);
        return isWithinInterval(devDate, { start: weekStart, end: weekEnd });
      });

      const allWeekTasks = [...weekTodos, ...weekPlans];
      const completedWeekTasks = allWeekTasks.filter(task => task.completed).length;
      const totalWeekTasks = allWeekTasks.length;
      const avgDevelopmentProgress = weekDevelopments.length > 0 
        ? weekDevelopments.reduce((sum: number, dev: any) => sum + dev.progress, 0) / weekDevelopments.length 
        : 0;
      
      const weekProgress = totalWeekTasks > 0 
        ? ((completedWeekTasks / totalWeekTasks) * 50) + (avgDevelopmentProgress * 0.5)
        : avgDevelopmentProgress;
      
      progress.push(Math.min(weekProgress, 100));
    }
    
    setWeeklyProgress(progress);
  }, []);

  const data = {
    labels: ['3 weeks ago', '2 weeks ago', 'Last week', 'This week'],
    datasets: [
      {
        label: 'Weekly Progress (%)',
        data: weeklyProgress,
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return 'Progress: ' + context.parsed.y.toFixed(1) + '%';
          }
        }
      }
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}