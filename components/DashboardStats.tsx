import React from 'react';
import { DashboardStats as IStats } from '../types';
import { AlertOctagon, CheckCircle, Clock, Zap } from 'lucide-react';

interface DashboardStatsProps {
  stats: IStats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
           <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Open Tickets</p>
           <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.openCount}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
           <Zap className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
           <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Critical Issues</p>
           <h3 className="text-3xl font-bold text-red-600 mt-1">{stats.criticalCount}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
           <AlertOctagon className="text-red-500" size={24} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
           <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Avg Resolution</p>
           <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.avgResolutionTimeHours}h</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
           <CheckCircle className="text-purple-600" size={24} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
           <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">SLA Risk</p>
           <h3 className="text-3xl font-bold text-orange-600 mt-1">{stats.slaBreachRisk}%</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
           <Clock className="text-orange-500" size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
