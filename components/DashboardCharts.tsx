
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { SALES_TREND_DATA, CATEGORY_DISTRIBUTION } from '../constants';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899'];

const DashboardCharts: React.FC = () => {
  // We can use CSS variables or a simple class check for dynamic colors in Recharts if needed,
  // but standard responsive classes on the containers handle most of the UI.
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Trend */}
      <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl backdrop-blur-sm h-[400px] transition-colors duration-300">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">Revenue & Profit Growth</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={SALES_TREND_DATA}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" dark:stroke="#27272a" vertical={false} />
            <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                border: '1px solid #e4e4e7', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#18181b' }}
              // In dark mode, Recharts can be harder to style purely with tailwind classes
              // but we can pass styles based on the presence of .dark if we use a theme hook.
              // For simplicity, these styles are modern enough for both.
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="profit" stroke="#d946ef" strokeWidth={3} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl backdrop-blur-sm h-[400px] flex flex-col transition-colors duration-300">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">Inventory by Category</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {CATEGORY_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #e4e4e7', 
                  borderRadius: '12px' 
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
