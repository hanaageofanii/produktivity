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
import { Pie } from 'react-chartjs-2';

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

export default function ExpenseBreakdownChart() {
  const [expenseData, setExpenseData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const finances = JSON.parse(localStorage.getItem('finances') || '[]');
    const expenses = finances.filter((f: any) => f.type === 'expense');
    
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense: any) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    setExpenseData(categoryTotals);
  }, []);

  const categories = Object.keys(expenseData);
  const amounts = Object.values(expenseData);

  const data = {
    labels: categories.length > 0 ? categories : ['No Data'],
    datasets: [
      {
        data: amounts.length > 0 ? amounts : [1],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(245, 158, 11, 0.8)',  // amber
          'rgba(34, 197, 94, 0.8)',   // green
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(168, 85, 247, 0.8)',  // purple
          'rgba(236, 72, 153, 0.8)',  // pink
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
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
            if (categories.length === 0) return 'No expense data';
            const total = amounts.reduce((sum, amount) => sum + amount, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return context.label + ': Rp ' + context.parsed.toLocaleString('id-ID') + ' (' + percentage + '%)';
          }
        }
      }
    },
  };

  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  );
}