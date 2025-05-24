import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: 'blue' | 'indigo' | 'red' | 'yellow' | 'purple' | 'green';
  prefix?: string;
}

export function DashboardCard({ title, value, icon, color, prefix = '' }: DashboardCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 flex items-center relative">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className={`text-3xl font-bold ${colorClasses[color].text} mt-2`}>
          {prefix}
          {value}
        </p>
      </div>
      <div className={`absolute top-4 right-4 rounded-full ${colorClasses[color].bg} p-3 ${colorClasses[color].text}`}>
        {icon}
      </div>
    </div>
  );
}