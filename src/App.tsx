import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FtcDisclaimerBanner } from './components/FtcDisclaimerBanner';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BuyingGuidesHub } from './components/BuyingGuidesHub';
import { ArticleModal } from './components/ArticleModal';
import { CreateArticleModal } from './components/CreateArticleModal';
import { AutopilotCommandCenter } from './components/AutopilotCommandCenter';
import { SeoStudio } from './components/SeoStudio';
import { ComparisonMatrixModal } from './components/ComparisonMatrixModal';
import { AiShoppingAdvisorModal } from './components/AiShoppingAdvisorModal';
import { AffiliateAnalyticsModal } from './components/AffiliateAnalyticsModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ARTICLES, 
  INITIAL_AUTOPILOT_LOGS, 
  INITIAL_AFFILIATE_SETTINGS 
} from './data/seedData';
import { Product, Article, AutopilotLog, AffiliateSettings, PriceAlert, ClickRecord } from './types';
import { Sparkles, CheckCircle2, ArrowRight, Layers, Bell, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { buildAffiliateUrl } from './utils/affiliateHelper';

export default function App() {
  // --- Persistent State ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('affilipulse_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
        // Ensure all stores have direct external affiliate URLs synced
        return parsed.map((p: Product) => {
          const fresh = INITIAL_PRODUCTS.find(fp => fp.id === p.id);
          if (fresh) {
            return { ...p, stores: fresh.stores };
          }
          return p;
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('affilipulse_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [autopilotLogs, setAutopilotLogs] = useState<AutopilotLog[]>(() => {
    const saved = localStorage.getItem('affilipulse_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUTOPILOT_LOGS;
  });

  const [settings, setSettings] = useState<AffiliateSettings>(() => {
    const saved = localStorage.getItem('affilipulse_settings');
    return saved ? JSON.parse(saved) : INITIAL_AFFILIATE_SETTINGS;
  });

  const [pinnedProductIds, setPinnedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('affilipulse_pinned');
    return saved ? JSON.parse(saved) : ['prod-sony-wh1000xm5', 'prod-apple-airpods-max-usbc'];
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('affilipulse_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [clickRecords, setClickRecords] = useState<ClickRecord[]>(() => {
    const saved = localStorage.getItem('affilipulse_clicks');
    return saved ? JSON.parse(saved) : [];
  });

  // --- UI Navigation State ---
  const [activeTab, setActiveTab] = useState<'catalog' | 'guides' | 'autopilot' | 'seo' | 'compare'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- Modals State ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleGeneratorOpen, setIsArticleGeneratorOpen] = useState(false);
  const [isShoppingAdvisorOpen, setIsShoppingAdvisorOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [priceAlertProduct, setPriceAlertProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- AI Loading States ---
  const [isScouting, setIsScouting] = useState(false);
  const [isAutopilotRunning, setIsAutopilotRunning] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('affilipulse_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('affilipulse_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('affilipulse_logs', JSON.stringify(autopilotLogs));
  }, [autopilotLogs]);

  useEffect(() => {
    localStorage.setItem('affilipulse_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('affilipulse_pinned', JSON.stringify(pinnedProductIds));
  }, [pinnedProductIds]);

  useEffect(() => {
    localStorage.setItem('affilipulse_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem('affilipulse_clicks', JSON.stringify(clickRecords));
  }, [clickRecords]);

  // Auto-resolve any legacy /go/... links if accessed directly on static hosts (Netlify/Vercel/Cloudflare)
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/go/')) {
      const parts = pathname.replace('/go/', '').split('/');
      const productId = parts[0];
      const storeName = parts[1] || 'amazon';
      const matched = products.find(p => p.id === productId);
      if (matched) {
        const dest = buildAffiliateUrl(matched, storeName, settings);
        window.location.replace(dest);
      }
    }
  }, [products, settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- AI Operations Handlers ---

  // 1. AI Product Scout
  const handleScoutProducts = async (niche = selectedCategory === 'All' ? 'Tech & Audio' : selectedCategory) => {
    setIsScouting(true);
    try {
      const existingTitles = products.map(p => p.title);
      const res = await fetch('/api/ai/scout-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          count: 3,
          existingTitles
        })
      });

      if (!res.ok) throw new Error('AI Scout request failed');

      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        const newProducts: Product[] = data.products.map((item: any, idx: number) => ({
          id: `ai-scout-${Date.now()}-${idx}`,
          title: item.title,
          shortName: item.shortName || item.title.slice(0, 30),
          category: item.category || niche,
          badge: item.badge || "Editor's Choice",
          price: Number(item.price) || 199.99,
          originalPrice: Number(item.originalPrice) || (Number(item.price) * 1.25),
          rating: Number(item.rating) || 4.8,
          reviewCount: Number(item.reviewCount) || 1240,
          imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
          summary: item.summary || 'Expertly tested and benchmarked by AI for build quality and performance.',
          whyWeRecommend: item.whyWeRecommend || 'Tested thoroughly in our autonomous lab.',
          whoItsFor: item.whoItsFor || 'Enthusiasts and professionals.',
          whoShouldSkip: item.whoShouldSkip || 'Casual users on a tight budget.',
          pros: Array.isArray(item.pros) ? item.pros : ['High build quality', 'Excellent value', 'Top-tier ergonomics'],
          cons: Array.isArray(item.cons) ? item.cons : ['Premium price point', 'Stock availability varies'],
          specs: item.specs || { 'Build': 'Anodized Aluminum', 'Warranty': '2 Years', 'Connectivity': 'Wireless' },
          benchmarkScores: item.benchmarkScores || { buildQuality: 9.4, performance: 9.6, valueForMoney: 9.0, easeOfUse: 9.2, features: 9.5 },
          seoKeywords: item.seoKeywords || ['tech deals 2026', 'best hardware review'],
          metaDescription: item.metaDescription || `Read our verified review of ${item.title}. Compare live prices across authorized retailers.`,
          stores: item.stores || [
            { storeName: 'Amazon', price: Number(item.price), inStock: true, affiliateSuffix: `&tag=${settings.amazonAssociateId || 'crazdaveaipic-20'}` },
            { storeName: 'Best Buy', price: Number(item.price) * 1.05, inStock: true, affiliateSuffix: '&siteID=affilipulse' }
          ],
          priceHistory: [
            { date: '2026-06-01', price: Number(item.originalPrice) || 249.99 },
            { date: '2026-08-24', price: Number(item.price) }
          ],
          lastUpdated: new Date().toISOString(),
          views: 120,
          outClicks: 14
        }));

        setProducts(prev => [...newProducts, ...prev]);
        showToast(`AI Scout successfully discovered & ingested ${newProducts.length} new trending products!`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error scouting products: ' + (err.message || 'Server error'));
    } finally {
      setIsScouting(false);
    }
  };

  // 2. AI Autopilot Scheduled Cycle Execution
  const handleTriggerAutopilotCycle = async () => {
    setIsAutopilotRunning(true);
    try {
      const res = await fetch('/api/ai/autopilot-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeNiches: settings.targetNiches,
          currentProductCount: products.length
        })
      });

      if (!res.ok) throw new Error('Autopilot run failed');

      const data = await res.json();
      if (data.runResult) {
        const newLog: AutopilotLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          summary: data.runResult.summary,
          actionsPerformed: data.runResult.actionsPerformed,
          priceUpdates: data.runResult.priceUpdates || [],
          trendingOpportunity: data.runResult.trendingOpportunity,
          generatedArticleIdea: data.runResult.generatedArticleIdea,
          seoHealthScore: data.runResult.seoHealthScore || 98
        };

        setAutopilotLogs(prev => [newLog, ...prev]);

        // If price updates occurred, apply discount adjustments to catalog
        if (data.runResult.priceUpdates && data.runResult.priceUpdates.length > 0) {
          setProducts(prev => prev.map(p => {
            const update = data.runResult.priceUpdates.find((u: any) => 
              p.title.toLowerCase().includes(u.productName.toLowerCase()) || 
              u.productName.toLowerCase().includes(p.shortName.toLowerCase())
            );
            if (update) {
              return {
                ...p,
                price: update.newPrice,
                lastUpdated: new Date().toISOString()
              };
            }
            return p;
          }));
        }

        showToast(`Autonomous market scan complete: ${data.runResult.actionsPerformed.length} actions logged.`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error running autopilot: ' + (err.message || 'Server error'));
    } finally {
      setIsAutopilotRunning(false);
    }
  };

  // 3. AI SEO Buying Guide Generator
  const handleGenerateArticle = async (topic: string, category: string, productNames: string[]) => {
    setIsGeneratingArticle(true);
    try {
      const res = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, productNames })
      });

      if (!res.ok) throw new Error('Article generation failed');

      const data = await res.json();
      if (data.article) {
        const newArticle: Article = {
          id: `art-${Date.now()}`,
          title: data.article.title,
          slug: data.article.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          metaDescription: data.article.metaDescription,
          category: category || 'Tech & Audio',
          readTime: data.article.readTime || '6 min read',
          publishedAt: new Date().toISOString(),
          coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
          author: {
            name: 'AffiliPulse AI Editorial Lab',
            role: 'Autonomous Hardware Testing Benchmark',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          },
          intro: data.article.intro,
          keyTakeaways: data.article.keyTakeaways || [],
          sections: data.article.sections || [],
          buyingCriteria: data.article.buyingCriteria || [],
          faqs: data.article.faqs || [],
          jsonLdSchema: data.article.jsonLdSchema || JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": data.article.title,
            "description": data.article.metaDescription
          })
        };

        setArticles(prev => [newArticle, ...prev]);
        setIsArticleGeneratorOpen(false);
        setSelectedArticle(newArticle);
        showToast(`SEO Buyer's Guide published: "${newArticle.title}"`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error generating guide: ' + (err.message || 'Server error'));
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // --- Outbound Link Redirection Handler ---
  const handleOutboundClick = (product: Product, storeName: string) => {
    // Record telemetry
    const comm = Number((product.price * 0.045).toFixed(2));
    const newRecord: ClickRecord = {
      id: `clk-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      storeName,
      price: product.price,
      timestamp: new Date().toISOString(),
      estimatedCommission: comm
    };

    setClickRecords(prev => [newRecord, ...prev]);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, outClicks: (p.outClicks || 0) + 1 } : p));

    const activeTag = settings.amazonAssociateId || 'crazdaveaipic-20';
    showToast(`Redirecting to ${storeName}... Applied affiliate partner tag [${activeTag}] (+~$${comm} est. commission)`);
    
    // Direct destination affiliate URL (compatible with Netlify, Vercel, static CDN, and server deployments)
    const directUrl = buildAffiliateUrl(product, storeName, settings);
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  // --- Comparison & Pin Handlers ---
  const handleTogglePin = (productId: string) => {
    if (pinnedProductIds.includes(productId)) {
      setPinnedProductIds(prev => prev.filter(id => id !== productId));
      showToast('Removed product from comparison matrix.');
    } else {
      if (pinnedProductIds.length >= 4) {
        showToast('Maximum 4 items can be compared simultaneously.');
        return;
      }
      setPinnedProductIds(prev => [...prev, productId]);
      showToast('Added product to side-by-side comparison!');
    }
  };

  // Filter products by category & search query
  const categories: string[] = Array.from(new Set(products.map(p => p.category)));
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.seoKeywords && p.seoKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const pinnedProducts = products.filter(p => pinnedProductIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* FTC Disclaimer Notice */}
      <FtcDisclaimerBanner />

      {/* Top Bar Header (Matches Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pinnedCount={pinnedProductIds.length}
        onOpenShoppingAdvisor={() => setIsShoppingAdvisorOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        isAutopilotRunning={settings.isAutopilotActive}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {activeTab === 'catalog' && (
          <div>
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              totalProducts={products.length}
              totalDeals={products.filter(p => p.originalPrice > p.price).length}
              onTriggerScout={() => handleScoutProducts()}
              isScouting={isScouting}
            />

            {/* Product Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              
              {/* Category Count Bar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {selectedCategory === 'All' ? 'All Curated Products & Deals' : `${selectedCategory} Deals`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Showing {filteredProducts.length} verified products with live multi-retailer price checks.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    FTC Tagged
                  </span>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-[#121214] border border-white/10 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-2xl">
                  <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white mb-1">No Matching Products Found</h3>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Try another search term or trigger our AI Scout to discover new products in this category.
                  </p>
                  <button
                    onClick={() => handleScoutProducts(selectedCategory === 'All' ? 'Tech & Audio' : selectedCategory)}
                    disabled={isScouting}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                  >
                    {isScouting ? 'Scouting with AI...' : 'AI Scout New Products'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                      onTogglePin={handleTogglePin}
                      isPinned={pinnedProductIds.includes(product.id)}
                      onOpenPriceAlert={(p) => setPriceAlertProduct(p)}
                      onOutboundClick={handleOutboundClick}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <BuyingGuidesHub
            articles={articles}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onOpenCreateArticleModal={() => setIsArticleGeneratorOpen(true)}
            products={products}
          />
        )}

        {activeTab === 'autopilot' && (
          <AutopilotCommandCenter
            settings={settings}
            setSettings={setSettings}
            logs={autopilotLogs}
            onTriggerAutopilotCycle={handleTriggerAutopilotCycle}
            onTriggerProductScout={(niche) => handleScoutProducts(niche)}
            onOpenArticleGenerator={() => setIsArticleGeneratorOpen(true)}
            isAutopilotRunning={settings.isAutopilotActive}
            isActionLoading={isScouting || isAutopilotRunning}
            totalProductsCount={products.length}
          />
        )}

        {activeTab === 'seo' && (
          <SeoStudio
            products={products}
            articles={articles}
            settings={settings}
          />
        )}

        {activeTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ComparisonMatrixModal
              pinnedProducts={pinnedProducts}
              onClose={() => setActiveTab('catalog')}
              onRemovePinned={handleTogglePin}
              onClearAllPinned={() => setPinnedProductIds([])}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOutboundClick={handleOutboundClick}
            />
          </div>
        )}

      </main>

      {/* Floating Comparison Tray (if pinned items > 0 and not on compare tab) */}
      {pinnedProductIds.length > 0 && activeTab !== 'compare' && (
        <div className="fixed bottom-5 right-5 z-40 bg-[#121214]/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-3 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">
              {pinnedProductIds.length} Products Pinned
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compare')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setPinnedProductIds([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear pinned"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#121214] border border-indigo-500/40 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-white animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOutboundClick={handleOutboundClick}
          onOpenPriceAlert={(p) => setPriceAlertProduct(p)}
          onTogglePin={handleTogglePin}
          isPinned={pinnedProductIds.includes(selectedProduct.id)}
        />
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Create Article Generator Modal */}
      {isArticleGeneratorOpen && (
        <CreateArticleModal
          onClose={() => setIsArticleGeneratorOpen(false)}
          onGenerate={handleGenerateArticle}
          isGenerating={isGeneratingArticle}
          products={products}
        />
      )}

      {/* AI Shopping Advisor Modal */}
      {isShoppingAdvisorOpen && (
        <AiShoppingAdvisorModal
          onClose={() => setIsShoppingAdvisorOpen(false)}
          products={products}
          onSelectProduct={(p) => {
            setIsShoppingAdvisorOpen(false);
            setSelectedProduct(p);
          }}
        />
      )}

      {/* Affiliate Analytics Modal */}
      {isAnalyticsOpen && (
        <AffiliateAnalyticsModal
          onClose={() => setIsAnalyticsOpen(false)}
          settings={settings}
          setSettings={setSettings}
          products={products}
          clickRecords={clickRecords}
        />
      )}

      {/* Price Alert Modal */}
      {priceAlertProduct && (
        <PriceAlertModal
          product={priceAlertProduct}
          onClose={() => setPriceAlertProduct(null)}
          onSaveAlert={(alert) => {
            setPriceAlerts(prev => [alert, ...prev]);
            showToast(`Price alert saved! Monitoring ${alert.productTitle} for drops below $${alert.targetPrice}.`);
          }}
        />
      )}

      {/* Minimal Footer */}
      <footer className="bg-[#0D0D0F] border-t border-white/5 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-tight">AffiliPulse AI</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-400">Autonomous Affiliate Commerce & Multi-Store Pricing Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Schema.org JSON-LD Validated</span>
            <span>•</span>
            <span>FTC Compliant</span>
            <span>•</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
