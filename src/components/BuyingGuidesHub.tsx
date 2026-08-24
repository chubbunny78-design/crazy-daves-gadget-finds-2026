import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, ArrowRight, User, Calendar, Plus, FileText, ChevronRight, Check } from 'lucide-react';
import { Article, Product } from '../types';

interface BuyingGuidesHubProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenCreateArticleModal: () => void;
  products: Product[];
}

export function BuyingGuidesHub({
  articles,
  onSelectArticle,
  onOpenCreateArticleModal,
  products
}: BuyingGuidesHubProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              SEO Content & Buyer Guides
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Rank-Optimized</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Authoritative Testing & <span className="font-semibold italic text-indigo-400">Buyer Roundups</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Deep-dive buying guides, testing methodologies, and comparison roundups engineered by AI to capture high-intent organic search traffic.
          </p>
        </div>

        <button
          onClick={onOpenCreateArticleModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Guide with AI</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="bg-[#121214] border border-white/5 hover:border-white/15 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer group"
          >
            {/* Cover Image */}
            <div>
              <div className="aspect-16/9 bg-[#0A0A0B] rounded-xl overflow-hidden relative mb-4">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0A0A0B]/90 text-indigo-400 border border-white/10 backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="text-base font-medium text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {article.metaDescription}
                </p>

                {/* Key Takeaways snippet */}
                {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                  <div className="bg-[#0D0D0F] rounded-xl p-3 border border-white/5 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block mb-1">
                      Top Quick Pick:
                    </span>
                    <p className="text-xs text-slate-300 truncate font-medium">
                      {article.keyTakeaways[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Byline and Read Button */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/10"
                />
                <div className="truncate">
                  <span className="text-xs font-medium text-slate-300 block truncate">{article.author.name}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
