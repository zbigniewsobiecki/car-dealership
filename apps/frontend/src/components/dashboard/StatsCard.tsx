import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'blue' | 'green' | 'purple' | 'amber';
}

const variants = {
  blue: {
    card: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    text: 'text-blue-600',
    value: 'text-blue-900',
    iconBg: 'bg-blue-200',
    icon: 'text-blue-700',
  },
  green: {
    card: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    text: 'text-green-600',
    value: 'text-green-900',
    iconBg: 'bg-green-200',
    icon: 'text-green-700',
  },
  purple: {
    card: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    text: 'text-purple-600',
    value: 'text-purple-900',
    iconBg: 'bg-purple-200',
    icon: 'text-purple-700',
  },
  amber: {
    card: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    text: 'text-amber-600',
    value: 'text-amber-900',
    iconBg: 'bg-amber-200',
    icon: 'text-amber-700',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, variant }) => {
  const styles = variants[variant];

  return (
    <div className={`card ${styles.card}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${styles.text}`}>{title}</p>
          <p className={`text-3xl font-bold ${styles.value} mt-2`}>{value}</p>
        </div>
        <div className={`${styles.iconBg} p-3 rounded-full`}>
          <Icon className={`h-8 w-8 ${styles.icon}`} />
        </div>
      </div>
    </div>
  );
};