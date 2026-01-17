
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  subLabel?: string;
  icon: React.ReactNode;
  colorClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, subLabel, icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-baseline">
            <span className={`text-3xl font-bold mono ${colorClass}`}>{value}</span>
            <span className="ml-1 text-lg font-medium text-slate-400 dark:text-slate-500">{unit}</span>
          </div>
          {subLabel && (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subLabel}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
