
import React, { useState } from 'react';
import { getInventoryInsights } from '../services/geminiService';
import { Product } from '../types';

interface SmartAssistantProps {
  products: Product[];
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ products }) => {
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const result = await getInventoryInsights(products, query);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-zinc-900 border border-indigo-200 dark:border-indigo-500/20 p-6 rounded-2xl shadow-sm dark:shadow-lg mb-8 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)] dark:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">JZ9 AI Assistant</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">Intelligent inventory strategy & predictions</p>
        </div>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask JZ9 about stock levels, trends, or risks..."
          className="flex-1 bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm"
        />
        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          )}
          Analyze
        </button>
      </form>

      {insight && (
        <div className="mt-4 p-4 bg-white/60 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-3">
             <div className="flex-shrink-0 mt-1">
               <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
             </div>
             <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;