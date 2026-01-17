
export interface ChargingMetrics {
  voltage: number;
  current: number;
  power: number;
  soc: number;
  temperature: number;
  efficiency: number;
  sessionTime: number; // in seconds
  estimatedTimeRemaining: number; // in minutes
  costAccumulated: number;
  energyDelivered: number; // kWh
}

export interface ChartDataPoint {
  timestamp: string;
  power: number;
  soc: number;
}

export type Theme = 'light' | 'dark';

export interface AIInsight {
  title: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}
