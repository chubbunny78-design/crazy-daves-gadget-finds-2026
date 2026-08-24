import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, CheckCircle2, Tag, ArrowRight, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface AiShoppingAdvisorModalProps {
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface AdviceResponse {
  directAnswer: string;
  bestMatchProductId: string | null;
  keyRecommendationFactors: string[];
  moneySavingTip: string;
}

export function AiShoppingAdvisorModal({
  onClose,
  products,
  onSelectProduct
}: AiShoppingAdvisorModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    "I have $350 and need top-tier noise cancelling headphones for daily flights.",
    "What's the best robot vacuum for hardwood floors with pet hair?",
    "I'm starting a 4K YouTube channel, what camera should I invest in?",
    "I sit 9 hours a day coding and have lower back pain. Best ergonomic chair?"
  ];

  const handleAskAdvisor = async (promptText: string) => {
    if (!promptText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const catalogSummary = products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        category: p.category,
        pros: p.pros,
        whoItsFor: p.whoItsFor
      }));

      const res = await fetch('/api/ai/shopping-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: promptText,
          catalogSummary
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get recommendation from AI');
      }

      const data = await res.json();
      setAdvice(data.advice);
    } catch (err: any) {
      setError(err.message || 'Error consulting AI advisor');
    } finally {
      setLoading(false);
    }
  };

  const matchedProduct = advice?.bestMatchProductId 
    ? products.find(p => p.id === advice.bestMatchProductId || p.title.toLowerCase().includes(advice.bestMatchProductId.toLowerCase()) || p.shortName.toLowerCase().includes(advice.bestMatchProductId.toLowerCase()))
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Ask AffiliPulse AI Shopping Advisor</h3>
              <p className="text-[11px] text-slate-400">Describe your budget, space, or technical requirements</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Quick prompt suggestions */}
          {!advice && !loading && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block mb-2.5">
                Popular Shopper Queries:
              </span>
              <div className="space-y-1.5">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(sample);
                      handleAskAdvisor(sample);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-[#0D0D0F] border border-white/5 hover:border-indigo-500/40 hover:bg-white/5 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
              <h4 className="text-sm font-medium text-white">Synthesizing Lab Benchmarks & Multi-Store Pricing...</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Comparing real-world battery tests, acoustic attenuation, and current live merchant coupon codes.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* AI Advice Output */}
          {advice && !loading && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Direct Verdict */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Bot className="w-4 h-4" />
                  AI Advisor Recommendation
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-light">
                  {advice.directAnswer}
                </p>
              </div>

              {/* Matched Product Card */}
              {matchedProduct && (
                <div className="bg-[#0D0D0F] border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={matchedProduct.imageUrl}
                      alt={matchedProduct.title}
                      className="w-16 h-16 rounded-xl object-cover bg-[#0A0A0B] border border-white/5 shrink-0"
                    />
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                        {matchedProduct.badge}
                      </span>
                      <h4 className="text-xs font-semibold text-white mt-1">{matchedProduct.title}</h4>
                      <span className="text-xs font-mono text-indigo-400 font-medium">
                        ${matchedProduct.price.toFixed(2)} <span className="text-emerald-400 font-normal">(Save ${(matchedProduct.originalPrice - matchedProduct.price).toFixed(2)})</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectProduct(matchedProduct);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>View Deal & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Key Factors */}
              {advice.keyRecommendationFactors && (
                <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2.5">
                    Why This Fits Your Criteria:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {advice.keyRecommendationFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-sans text-xs">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Insider Savings Tip */}
              {advice.moneySavingTip && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-2.5">
                  <Tag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-amber-300 block">Insider Deal & Timing Tip:</span>
                    <p className="text-xs text-slate-300 mt-0.5">{advice.moneySavingTip}</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAdvisor(query);
            }}
            className="flex items-center gap-2 pt-2 border-t border-white/5"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your budget or product question..."
              className="flex-1 bg-[#0A0A0B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
