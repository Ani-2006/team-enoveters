
import React from 'react';

interface BatteryStatusProps {
  soc: number;
  isCharging: boolean;
}

const BatteryStatus: React.FC<BatteryStatusProps> = ({ soc, isCharging }) => {
  const getBatteryColor = (level: number) => {
    if (level > 20) return 'bg-emerald-500';
    if (level > 10) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative z-10 text-center">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-6 uppercase tracking-widest">Battery Level</h3>
        
        <div className="relative w-32 h-64 border-4 border-slate-200 dark:border-slate-600 rounded-2xl p-1">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-200 dark:border-slate-600 dark:bg-slate-600 rounded-t-md"></div>
          <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col justify-end">
            <div 
              className={`w-full transition-all duration-1000 ease-in-out ${getBatteryColor(soc)} ${isCharging ? 'animate-pulse' : ''}`}
              style={{ height: `${soc}%` }}
            >
              {isCharging && (
                <div className="w-full h-full bg-white opacity-20 animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-4xl font-black mono text-slate-800 dark:text-white drop-shadow-md">{Math.round(soc)}%</span>
          </div>
        </div>
        
        <div className="mt-6">
           <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${isCharging ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
             <div className={`w-2 h-2 rounded-full mr-2 ${isCharging ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></div>
             {isCharging ? 'Charging' : 'Standby'}
           </div>
        </div>
      </div>
      
      {/* Decorative Background Glow */}
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 ${isCharging ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
    </div>
  );
};

export default BatteryStatus;
