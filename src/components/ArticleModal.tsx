import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Share2, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Copy, 
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Article, Product } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function ArticleModal({
  article,
  onClose,
  products,
  onSelectProduct
}: ArticleModalProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showSchema, setShowSchema] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!article) return null;

  const handleCopySchema = () => {
    if (article.jsonLdSchema) {
      navigator.clipboard.writeText(article.jsonLdSchema);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>JSON-LD Schema</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 divide-y divide-white/5">
          
          {/* Article Title & Intro */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-white leading-tight mb-4">
              {article.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-white/5 text-xs">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
              <div>
                <span className="font-semibold text-white block">{article.author.name}</span>
                <span className="text-slate-500 text-[11px]">{article.author.role}</span>
              </div>
              <span className="text-white/10 mx-2">•</span>
              <span className="text-slate-500 font-mono text-[11px]">
                Updated {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Hero Image */}
            <div className="aspect-16/8 rounded-xl overflow-hidden mb-6 bg-[#0A0A0B] border border-white/10">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Key Takeaways Box */}
            {article.keyTakeaways && (
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 sm:p-5 mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Decision Summary & Top Picks
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Introduction paragraphs */}
            <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-4">
              {article.intro.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Article Sections */}
          <div className="pt-8 space-y-8">
            {article.sections.map((section, idx) => {
              // Find matching product if snippet is provided
              const matchedProduct = section.featuredProductSnippet 
                ? products.find(p => p.title.toLowerCase().includes(section.featuredProductSnippet!.toLowerCase()) || p.shortName.toLowerCase().includes(section.featuredProductSnippet!.toLowerCase()))
                : null;

              return (
                <div key={idx} className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-medium text-white">
                    {section.heading}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>

                  {/* Highlighted Product Card inside Section */}
                  {matchedProduct && (
                    <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={matchedProduct.imageUrl}
                          alt={matchedProduct.title}
                          className="w-16 h-16 rounded-lg object-cover bg-[#0A0A0B] border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                            Featured Top Pick
                          </span>
                          <h4 className="text-sm font-semibold text-white">{matchedProduct.title}</h4>
                          <span className="text-xs font-mono font-medium text-emerald-400">
                            Best Price: ${matchedProduct.price.toFixed(2)} (MSRP ${matchedProduct.originalPrice.toFixed(2)})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectProduct(matchedProduct);
                        }}
                        className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
                      >
                        <span>View Deal & Full Specs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Buying Criteria Matrix */}
          {article.buyingCriteria && article.buyingCriteria.length > 0 && (
            <div className="pt-8 space-y-4">
              <h3 className="text-lg font-medium text-white">
                Key Buying Criteria: How We Benchmark & Evaluate
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {article.buyingCriteria.map((crit, idx) => (
                  <div key={idx} className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-semibold text-white">{crit.title}</h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        crit.importance === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        crit.importance === 'High' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                        'bg-white/5 text-slate-300 border border-white/5'
                      }`}>
                        {crit.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{crit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Accordion (Rich SEO FAQ Snippet) */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">
                  Frequently Asked Questions (FAQ)
                </h3>
              </div>

              <div className="space-y-2">
                {article.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#0D0D0F] border border-white/5 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-200 hover:text-white"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Schema Drawer */}
          {showSchema && article.jsonLdSchema && (
            <div className="pt-8">
              <div className="bg-[#0A0A0B] border border-white/10 rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Schema.org JSON-LD (Article & FAQ)</span>
                  <button
                    onClick={handleCopySchema}
                    className="p-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                  >
                    {copiedSchema ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto p-2">
                  {article.jsonLdSchema}
                </pre>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
