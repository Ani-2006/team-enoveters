
import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface InsightsPanelProps {
  insight: string;
  loading: boolean;
  onRefresh: () => void;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insight, loading, onRefresh }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-90">AI Energy Insights</h3>
          </div>
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="min-h-[80px] flex items-center">
          {loading ? (
            <div className="space-y-2 w-full">
              <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-lg leading-relaxed font-medium">
              "{insight}"
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-200 uppercase">Powered by Gemini Pro</span>
          <div className="px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase">Optimizing</div>
        </div>
      </div>

      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
    </div>
  );
};

export default InsightsPanel;
