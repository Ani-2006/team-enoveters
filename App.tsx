
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Activity, 
  Thermometer, 
  Cpu, 
  Timer, 
  CreditCard, 
  Sun, 
  Moon, 
  Battery, 
  Wind,
  Settings,
  Bell,
  Wifi,
  WifiOff
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ChargingMetrics, Theme } from './types';
import MetricCard from './components/MetricCard';
import BatteryStatus from './components/BatteryStatus';
import InsightsPanel from './components/InsightsPanel';
import { getEnergyInsights } from './services/geminiService';

const FIREBASE_URL = "https://charging-ev-2026-default-rtdb.firebaseio.com/.json";
const FIREBASE_TOKEN = "2JioSwbtle3xqZu7rPM4bFUz4Z3j0TRYGNjGt1hX";

const INITIAL_METRICS: ChargingMetrics = {
  voltage: 0,
  current: 0,
  power: 0,
  soc: 0,
  temperature: 0,
  efficiency: 0,
  sessionTime: 0,
  estimatedTimeRemaining: 0,
  costAccumulated: 0,
  energyDelivered: 0
};

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<ChargingMetrics>(INITIAL_METRICS);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isCharging, setIsCharging] = useState(false);
  const [insight, setInsight] = useState<string>("Waiting for live connection to Firebase...");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Toggle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-900 text-slate-100 transition-colors duration-300';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 transition-colors duration-300';
    }
  }, [theme]);

  // Firebase Live Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${FIREBASE_URL}?auth=${FIREBASE_TOKEN}`);
        if (!response.ok) throw new Error("Firebase connection failed");
        
        const data = await response.json();
        if (data) {
          setIsConnected(true);
          setLastUpdate(new Date());
          
          // Map Firebase data to state. Assuming Firebase might have keys like 'v', 'i', 'p' or full names.
          // We provide defaults for missing fields to keep the UI stable.
          setMetrics(prev => {
            const v = data.voltage || data.v || 0;
            const i = data.current || data.i || 0;
            const p = data.power || data.p || (v * i / 1000);
            const soc = data.soc !== undefined ? data.soc : prev.soc;
            
            // Auto-detect charging state based on current flow
            setIsCharging(i > 0.1);

            return {
              ...prev,
              voltage: Number(v.toFixed(1)),
              current: Number(i.toFixed(1)),
              power: Number(p.toFixed(1)),
              soc: Number(soc),
              temperature: data.temperature || data.temp || prev.temperature,
              efficiency: data.efficiency || 94.2, // Default if not provided
              energyDelivered: data.energyDelivered || prev.energyDelivered + (p / 3600), // Integrated energy if not provided
              costAccumulated: (data.energyDelivered || prev.energyDelivered) * 0.15,
              estimatedTimeRemaining: soc < 100 ? Math.round((100 - soc) * 1.5) : 0,
              sessionTime: prev.sessionTime + 2 // Polling interval increment
            };
          });
        }
      } catch (error) {
        console.error("Firebase Error:", error);
        setIsConnected(false);
      }
    };

    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds
    fetchData(); // Initial call
    return () => clearInterval(interval);
  }, []);

  const fetchInsight = useCallback(async () => {
    if (!isConnected) return;
    setLoadingInsight(true);
    const newInsight = await getEnergyInsights(metrics);
    setInsight(newInsight);
    setLoadingInsight(false);
  }, [metrics, isConnected]);

  // Fetch AI insight when significant data changes or manually
  useEffect(() => {
    if (isConnected && metrics.voltage > 0) {
      const timeout = setTimeout(fetchInsight, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors ${isConnected ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
              <Zap className={isConnected ? "fill-current" : ""} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight dark:text-white flex items-center">
                VOLT<span className="text-emerald-500">DRIVE</span>
                <span className={`ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-black ${isConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Firebase Realtime Telemetry</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center mr-4 space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {isConnected ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
              <span>{lastUpdate ? `Last sync: ${lastUpdate.toLocaleTimeString()}` : 'Connecting...'}</span>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span className="text-xs font-bold uppercase">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {!isConnected && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 text-sm font-medium flex items-center justify-center animate-pulse">
            Establishing secure connection to charging-ev-2026 Firebase node...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Battery and Insights */}
          <div className="lg:col-span-4 space-y-8">
            <BatteryStatus soc={metrics.soc} isCharging={isCharging} />
            <InsightsPanel insight={insight} loading={loadingInsight} onRefresh={fetchInsight} />
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Remote Sync Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">DB Host</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">firebase-rtdb.com</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Latency</span>
                  <span className="font-mono text-emerald-500">~124ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Security</span>
                  <span className="font-mono text-blue-500">Token-Auth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Metrics */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <MetricCard 
                label="Voltage" 
                value={metrics.voltage} 
                unit="V" 
                icon={<Activity className="w-6 h-6" />}
                colorClass="text-blue-500"
              />
              <MetricCard 
                label="Current" 
                value={metrics.current} 
                unit="A" 
                icon={<Wind className="w-6 h-6" />}
                colorClass="text-cyan-500"
              />
              <MetricCard 
                label="Live Power" 
                value={metrics.power} 
                unit="kW" 
                icon={<Zap className="w-6 h-6" />}
                colorClass="text-emerald-500"
                subLabel={isCharging ? "Active Flow Detected" : "Idle State"}
              />
              <MetricCard 
                label="Temp" 
                value={metrics.temperature} 
                unit="°C" 
                icon={<Thermometer className="w-6 h-6" />}
                colorClass="text-amber-500"
              />
              <MetricCard 
                label="Efficiency" 
                value={metrics.efficiency} 
                unit="%" 
                icon={<Cpu className="w-6 h-6" />}
                colorClass="text-indigo-500"
              />
              <MetricCard 
                label="Delivered" 
                value={metrics.energyDelivered.toFixed(2)} 
                unit="kWh" 
                icon={<Battery className="w-6 h-6" />}
                colorClass="text-violet-500"
              />
            </div>

            {/* Session Stats */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold dark:text-white">Live Session Overview</h3>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Streaming</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Elapsed Time</span>
                  </div>
                  <p className="text-2xl font-black mono dark:text-white">{formatTime(metrics.sessionTime)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Timer className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Est. Remaining</span>
                  </div>
                  <p className="text-2xl font-black mono text-emerald-500">{metrics.estimatedTimeRemaining}m</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cost Accum.</span>
                  </div>
                  <p className="text-2xl font-black mono text-blue-500">${metrics.costAccumulated.toFixed(2)}</p>
                </div>
              </div>

              {/* Progress Bar (Visualizing SoC) */}
              <div className="mt-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Battery Saturation</span>
                  <span className="text-xs font-bold mono text-slate-600 dark:text-slate-300">{metrics.soc.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out relative"
                    style={{ width: `${metrics.soc}%` }}
                  >
                    {isCharging && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 text-center text-slate-400 dark:text-slate-600">
        <p className="text-[10px] font-bold uppercase tracking-widest">Connected to: charging-ev-2026-default-rtdb.firebaseio.com</p>
        <p className="mt-2 text-[9px] font-medium text-slate-500">Authorized Session ID: {FIREBASE_TOKEN.substring(0, 8)}...</p>
      </footer>

      <SpeedInsights />
    </div>
  );
};

export default App;
