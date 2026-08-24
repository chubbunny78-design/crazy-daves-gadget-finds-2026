import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Initialize Gemini client with proper User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // --- API Routes for AI Affiliate Operations ---

  // 1. AI Product Scout - Generates rich product reviews & specs for a niche
  app.post('/api/ai/scout-products', async (req, res) => {
    try {
      const { niche = 'Tech & Audio', count = 3, existingTitles = [] } = req.body;

      const prompt = `You are an elite e-commerce product scout and affiliate marketing expert for top publications like Wirecutter and RTINGS.
Generate ${count} high-converting, trending, top-rated products in the "${niche}" category.
Avoid these existing products: ${JSON.stringify(existingTitles)}.

For each product, provide:
1. title: Full descriptive name (e.g. "Sony WH-1000XM5 Wireless Noise Canceling Headphones")
2. shortName: Punchy display name
3. category: "${niche}"
4. badge: One of ["Editor's Choice", "Best Value", "Top Pick 2026", "Premium Pick", "Best Budget", "Staff Favorite"]
5. price: realistic current MSRP number in USD (e.g. 348.00)
6. originalPrice: realistic higher MSRP number (e.g. 399.99)
7. rating: realistic rating out of 5 (e.g. 4.8)
8. reviewCount: realistic reviews number (e.g. 4820)
9. summary: 2-3 sentence compelling editorial summary highlighting what makes it standout
10. whyWeRecommend: detailed paragraph explaining real-world testing verdict and why it won
11. whoItsFor: sentence describing the ideal user
12. whoShouldSkip: sentence describing who might want an alternative
13. pros: array of 3-4 distinct technical or practical advantages
14. cons: array of 2 honest minor drawbacks
15. specs: key-value object of 4-6 specs (e.g., Battery: "30 Hours", Weight: "250g", Connectivity: "Bluetooth 5.3", ANC: "Active Noise Cancelling V2")
16. benchmarkScores: scores out of 10 for buildQuality, performance, valueForMoney, easeOfUse, features
17. seoKeywords: array of 4-6 high-search-intent SEO keywords (e.g. ["best noise cancelling headphones 2026", "sony wh1000xm5 review", "wireless over ear headphones deals"])
18. metaDescription: 150-160 char SEO optimized meta description
19. stores: array of 3 merchant offers (e.g., Amazon, Best Buy, B&H) with storeName, price, inStock (boolean), affiliateSuffix (e.g., "&tag=affilipulse-20"), couponCode (optional e.g. "SAVE10")`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                shortName: { type: Type.STRING },
                category: { type: Type.STRING },
                badge: { type: Type.STRING },
                price: { type: Type.NUMBER },
                originalPrice: { type: Type.NUMBER },
                rating: { type: Type.NUMBER },
                reviewCount: { type: Type.INTEGER },
                summary: { type: Type.STRING },
                whyWeRecommend: { type: Type.STRING },
                whoItsFor: { type: Type.STRING },
                whoShouldSkip: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                specs: {
                  type: Type.OBJECT,
                  properties: {
                    spec1: { type: Type.STRING },
                    spec2: { type: Type.STRING },
                    spec3: { type: Type.STRING },
                    spec4: { type: Type.STRING },
                  }
                },
                benchmarkScores: {
                  type: Type.OBJECT,
                  properties: {
                    buildQuality: { type: Type.NUMBER },
                    performance: { type: Type.NUMBER },
                    valueForMoney: { type: Type.NUMBER },
                    easeOfUse: { type: Type.NUMBER },
                    features: { type: Type.NUMBER }
                  },
                  required: ['buildQuality', 'performance', 'valueForMoney', 'easeOfUse', 'features']
                },
                seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                metaDescription: { type: Type.STRING },
                stores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      storeName: { type: Type.STRING },
                      price: { type: Type.NUMBER },
                      inStock: { type: Type.BOOLEAN },
                      affiliateSuffix: { type: Type.STRING },
                      couponCode: { type: Type.STRING }
                    },
                    required: ['storeName', 'price', 'inStock']
                  }
                }
              },
              required: [
                'title', 'shortName', 'category', 'badge', 'price', 'originalPrice',
                'rating', 'reviewCount', 'summary', 'whyWeRecommend', 'whoItsFor',
                'whoShouldSkip', 'pros', 'cons', 'benchmarkScores', 'seoKeywords', 'metaDescription', 'stores'
              ]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      res.json({ success: true, products: data });
    } catch (err: any) {
      console.error('Error in /api/ai/scout-products:', err);
      res.status(500).json({ error: err.message || 'Failed to scout products' });
    }
  });

  // 2. AI SEO Buyer's Guide & Roundup Article Generator
  app.post('/api/ai/generate-article', async (req, res) => {
    try {
      const { topic, category, productNames = [] } = req.body;

      const prompt = `You are a world-class senior tech editor and SEO strategist writing an authoritative, search-engine optimized affiliate buying guide.
Topic: "${topic || 'The Best Audio and Productivity Gear for 2026'}"
Category: "${category || 'Tech & Audio'}"
Featured Products mentioned if applicable: ${JSON.stringify(productNames)}.

Generate a comprehensive, engaging article in structured JSON format with:
1. title: Catchy, high-CTR, SEO-friendly headline (e.g. "The 7 Best Noise-Cancelling Headphones of 2026: Tested & Compared")
2. slug: URL slug (e.g. "best-noise-cancelling-headphones-2026")
3. metaDescription: Under 160 characters, keyword rich with clear call to action
4. readTime: e.g. "6 min read"
5. intro: 2 engaging paragraphs setting up the buying problem, testing methodology, and who this guide is for
6. keyTakeaways: array of 3 bullet points summarizing top picks
7. sections: array of 4-5 content sections, each with:
   - heading: section title (e.g. "How We Tested: 40+ Hours in Real-World Environments", "Best Overall: Sony WH-1000XM5", "What to Look for Before Buying")
   - content: 2-3 detailed paragraphs with deep analysis, buying advice, and comparison
   - featuredProductSnippet: optional product summary name if section focuses on a specific pick
8. buyingCriteria: array of 4 objects with title, description, and importance ("Critical", "High", "Medium")
9. faqs: array of 4 frequent consumer questions with clear, expert answers
10. jsonLdSchema: JSON string containing valid Schema.org "Article" and "FAQPage" structure`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              slug: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              readTime: { type: Type.STRING },
              intro: { type: Type.STRING },
              keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    content: { type: Type.STRING },
                    featuredProductSnippet: { type: Type.STRING }
                  },
                  required: ['heading', 'content']
                }
              },
              buyingCriteria: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    importance: { type: Type.STRING }
                  },
                  required: ['title', 'description', 'importance']
                }
              },
              faqs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ['question', 'answer']
                }
              },
              jsonLdSchema: { type: Type.STRING }
            },
            required: ['title', 'slug', 'metaDescription', 'readTime', 'intro', 'keyTakeaways', 'sections', 'buyingCriteria', 'faqs']
          }
        }
      });

      const article = JSON.parse(response.text || '{}');
      res.json({ success: true, article });
    } catch (err: any) {
      console.error('Error in /api/ai/generate-article:', err);
      res.status(500).json({ error: err.message || 'Failed to generate article' });
    }
  });

  // 3. AI Autonomous Auto-Pilot Cycle
  // Simulates an automated scheduled cron job that discovers market changes,
  // updates pricing, flags trending deals, and writes fresh copy.
  app.post('/api/ai/autopilot-run', async (req, res) => {
    try {
      const { activeNiches = ['Tech & Audio', 'Smart Home', 'Creator Gear'], currentProductCount = 10 } = req.body;

      const prompt = `You are the autonomous AI core running an automated affiliate e-commerce store.
Execute a scheduled cycle across the active niches: ${JSON.stringify(activeNiches)}.
Current catalog size: ${currentProductCount} products.

Simulate real market intelligence and output a structured log and updates:
1. executionTime: e.g. "2026-08-24T10:30:00Z"
2. summary: A 1-2 sentence overview of what the autopilot crawled and found
3. actionsPerformed: array of 4-6 detailed action logs (e.g. "Scanned 142 Amazon & Best Buy SKU prices", "Detected 22% price drop on Sony WH-1000XM5", "Generated SEO review update for 4 products", "Audited FTC affiliate disclosure links")
4. priceUpdates: array of 2-3 items with { productName: string, oldPrice: number, newPrice: number, changePercent: number, dealReason: string }
5. trendingOpportunity: { niche: string, searchVolumeSurge: string, recommendation: string }
6. generatedArticleIdea: { title: string, targetKeywords: string[], estimatedMonthlySearchVolume: number }
7. seoHealthScore: number between 92 and 99`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executionTime: { type: Type.STRING },
              summary: { type: Type.STRING },
              actionsPerformed: { type: Type.ARRAY, items: { type: Type.STRING } },
              priceUpdates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    oldPrice: { type: Type.NUMBER },
                    newPrice: { type: Type.NUMBER },
                    changePercent: { type: Type.NUMBER },
                    dealReason: { type: Type.STRING }
                  },
                  required: ['productName', 'oldPrice', 'newPrice', 'changePercent', 'dealReason']
                }
              },
              trendingOpportunity: {
                type: Type.OBJECT,
                properties: {
                  niche: { type: Type.STRING },
                  searchVolumeSurge: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ['niche', 'searchVolumeSurge', 'recommendation']
              },
              generatedArticleIdea: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedMonthlySearchVolume: { type: Type.NUMBER }
                },
                required: ['title', 'targetKeywords', 'estimatedMonthlySearchVolume']
              },
              seoHealthScore: { type: Type.NUMBER }
            },
            required: ['executionTime', 'summary', 'actionsPerformed', 'priceUpdates', 'trendingOpportunity', 'generatedArticleIdea', 'seoHealthScore']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ success: true, runResult: data });
    } catch (err: any) {
      console.error('Error in /api/ai/autopilot-run:', err);
      res.status(500).json({ error: err.message || 'Failed to run autopilot' });
    }
  });

  // 4. AI Shopping Advisor & Deal Finder
  app.post('/api/ai/shopping-advisor', async (req, res) => {
    try {
      const { userQuery, catalogSummary = [] } = req.body;

      const prompt = `You are AffiliPulse AI, an unbiased, hyper-accurate shopping advisor.
The user is asking: "${userQuery}".
Available store catalog excerpt: ${JSON.stringify(catalogSummary)}.

Provide:
1. directAnswer: 2-3 warm, authoritative, highly specific sentences answering their request
2. bestMatchProductId: ID or title of best matching product from the catalog (or null if general advice)
3. keyRecommendationFactors: 3 concise bullet points on why this fits their budget/needs
4. moneySavingTip: 1 insider affiliate deal or buying timing tip`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              directAnswer: { type: Type.STRING },
              bestMatchProductId: { type: Type.STRING },
              keyRecommendationFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
              moneySavingTip: { type: Type.STRING }
            },
            required: ['directAnswer', 'keyRecommendationFactors', 'moneySavingTip']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ success: true, advice: data });
    } catch (err: any) {
      console.error('Error in /api/ai/shopping-advisor:', err);
      res.status(500).json({ error: err.message || 'Failed to get shopping advice' });
    }
  });

  // 5. Outbound Affiliate Cloaked Redirect Tracker
  app.get('/go/:productId/:storeName?', (req, res) => {
    const { productId, storeName = 'amazon' } = req.params;
    const affiliateTag = req.query.tag || 'crazdaveaipic-20';
    const query = req.query.q ? encodeURIComponent(String(req.query.q)) : '';
    
    // Build actual Amazon search or product URL with the user's affiliate tag
    let targetUrl = '';
    const cleanStore = storeName.toLowerCase().trim();
    if (cleanStore.includes('amazon')) {
      if (query) {
        targetUrl = `https://www.amazon.com/s?k=${query}&tag=${affiliateTag}`;
      } else {
        targetUrl = `https://www.amazon.com/s?k=${productId}&tag=${affiliateTag}`;
      }
    } else if (cleanStore.includes('bestbuy') || cleanStore.includes('best buy')) {
      targetUrl = `https://www.bestbuy.com/site/searchpage.jsp?st=${query || productId}`;
    } else if (cleanStore.includes('b&h') || cleanStore.includes('bh')) {
      targetUrl = `https://www.bhphotovideo.com/c/search?Ntt=${query || productId}`;
    } else {
      targetUrl = `https://www.google.com/search?q=${query || productId}+${cleanStore}`;
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to ${storeName}...</title>
          <meta http-equiv="refresh" content="1;url=${targetUrl}">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0A0A0B; color: #e2e8f0; }
            .card { background: #121214; border: 1px solid rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 16px; text-align: center; max-width: 440px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
            .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #6366f1; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .tag { display: inline-block; background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); font-family: monospace; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 6px; margin: 0.5rem 0 1rem; }
            a { color: #818cf8; text-decoration: none; word-break: break-all; font-size: 0.85rem; font-weight: 500; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem; font-weight: 600;">Redirecting to ${storeName}...</h3>
            <div><span class="tag">Partner Tag: ${affiliateTag}</span></div>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0 0 1.25rem 0; line-height: 1.5;">Applying best live merchant pricing, discount codes, and affiliate attribution.</p>
            <p><a href="${targetUrl}">Click here if not redirected automatically &rarr;</a></p>
          </div>
        </body>
      </html>
    `);
  });

  // Setup Vite dev server or static file serving
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AffiliPulse AI Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer();
