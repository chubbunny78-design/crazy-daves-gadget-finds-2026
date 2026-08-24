export interface StoreOffer {
  storeName: string;
  price: number;
  inStock: boolean;
  affiliateSuffix: string;
  couponCode?: string;
  url?: string;
}

export interface Product {
  id: string;
  title: string;
  shortName: string;
  category: string;
  badge: "Editor's Choice" | "Best Value" | "Top Pick 2026" | "Premium Pick" | "Best Budget" | "Staff Favorite" | string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  summary: string;
  whyWeRecommend: string;
  whoItsFor: string;
  whoShouldSkip: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  benchmarkScores: {
    buildQuality: number;
    performance: number;
    valueForMoney: number;
    easeOfUse: number;
    features: number;
  };
  seoKeywords: string[];
  metaDescription: string;
  stores: StoreOffer[];
  priceHistory: { date: string; price: number }[];
  lastUpdated: string;
  views: number;
  outClicks: number;
}

export interface ArticleSection {
  heading: string;
  content: string;
  featuredProductSnippet?: string;
}

export interface BuyingCriterion {
  title: string;
  description: string;
  importance: 'Critical' | 'High' | 'Medium';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  category: string;
  readTime: string;
  publishedAt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  intro: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  buyingCriteria: BuyingCriterion[];
  faqs: FaqItem[];
  jsonLdSchema?: string;
  featuredProductIds?: string[];
}

export interface PriceUpdateLog {
  productName: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  dealReason: string;
}

export interface AutopilotLog {
  id: string;
  timestamp: string;
  summary: string;
  actionsPerformed: string[];
  priceUpdates: PriceUpdateLog[];
  trendingOpportunity: {
    niche: string;
    searchVolumeSurge: string;
    recommendation: string;
  };
  generatedArticleIdea?: {
    title: string;
    targetKeywords: string[];
    estimatedMonthlySearchVolume: number;
  };
  seoHealthScore: number;
}

export interface AffiliateSettings {
  amazonAssociateId: string;
  impactPartnerId: string;
  cjPublisherId: string;
  shareASaleId: string;
  rakutenId: string;
  cloakedPrefix: string;
  autopilotFrequency: '1h' | '6h' | '12h' | '24h';
  isAutopilotActive: boolean;
  autoPublishGuides: boolean;
  targetNiches: string[];
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  targetPrice: number;
  currentPrice: number;
  userEmail: string;
  createdAt: string;
  isTriggered: boolean;
}

export interface ClickRecord {
  id: string;
  productId: string;
  productTitle: string;
  storeName: string;
  price: number;
  timestamp: string;
  estimatedCommission: number;
}
