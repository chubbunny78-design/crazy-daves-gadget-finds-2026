import React, { useState } from 'react';
import { X, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface CreateArticleModalProps {
  onClose: () => void;
  onGenerate: (topic: string, category: string, productNames: string[]) => Promise<void>;
  isGenerating: boolean;
  products: Product[];
}

export function CreateArticleModal({
  onClose,
  onGenerate,
  isGenerating,
  products
}: CreateArticleModalProps) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Tech & Audio');
  const [selectedProductNames, setSelectedProductNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const presetTopics = [
    { topic: 'The 5 Best Noise-Cancelling Headphones for Long Flights', category: 'Tech & Audio' },
    { topic: 'Ultimate Smart Home Floor Care: Robot Vacuums Tested', category: 'Smart Home & Automation' },
    { topic: 'Top Mirrorless Cameras for 4K Content Creators in 2026', category: 'Creator & Office Gear' },
    { topic: 'Ergonomic Desk Chairs for Remote Software Engineers', category: 'Creator & Office Gear' }
  ];

  const handleToggleProduct = (title: string) => {
    if (selectedProductNames.includes(title)) {
      setSelectedProductNames(selectedProductNames.filter(t => t !== title));
    } else {
      setSelectedProductNames([...selectedProductNames, title]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter an article topic or select a preset.');
      return;
    }
    setError(null);
    await onGenerate(topic.trim(), category, selectedProductNames);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Generate SEO Buying Guide</h3>
              <p className="text-[11px] text-slate-400">Powered by Gemini 3.7 Flash with Schema.org JSON-LD</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Quick Trending Inspiration Presets:
            </label>
            <div className="space-y-1.5">
              {presetTopics.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setTopic(preset.topic);
                    setCategory(preset.category);
                  }}
                  className="w-full text-left p-3 rounded-xl text-xs bg-[#0D0D0F] border border-white/5 hover:border-indigo-500/40 hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-semibold block">{preset.topic}</span>
                  <span className="text-[10px] text-indigo-400 font-mono mt-0.5 block">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Custom Article Title / Topic:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The 7 Best Ergonomic Keyboards for Programmers"
              className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              disabled={isGenerating}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              disabled={isGenerating}
            >
              <option value="Tech & Audio">Tech & Audio</option>
              <option value="Smart Home & Automation">Smart Home & Automation</option>
              <option value="Creator & Office Gear">Creator & Office Gear</option>
              <option value="Outdoors & Fitness">Outdoors & Fitness</option>
              <option value="Espresso & Coffee Gear">Espresso & Coffee Gear</option>
            </select>
          </div>

          {/* Featured Product Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Embed Existing Catalog Products (Optional):
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1 bg-[#0A0A0B] border border-white/10 rounded-xl p-2">
              {products.map((p) => {
                const isSelected = selectedProductNames.includes(p.shortName);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleToggleProduct(p.shortName)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="text-[10px] font-mono shrink-0 ml-2 font-medium">${p.price.toFixed(0)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Drafting SEO Guide with AI...' : 'Generate Rank-Ready Guide'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
