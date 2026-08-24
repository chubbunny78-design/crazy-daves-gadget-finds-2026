import { Product, AffiliateSettings } from '../types';

export const DEFAULT_AMAZON_TAG = 'crazdaveaipic-20';

/**
 * Builds direct, verified Amazon Associates affiliate link for a product.
 * Opens directly on amazon.com with tag=crazdaveaipic-20.
 */
export function getAmazonAffiliateUrl(
  product: Product,
  associateTag: string = DEFAULT_AMAZON_TAG
): string {
  const tag = (associateTag && associateTag.trim()) || DEFAULT_AMAZON_TAG;
  
  // If product already has an explicit Amazon store URL
  const amazonStore = product.stores?.find(s => s.storeName.toLowerCase() === 'amazon');
  if (amazonStore?.url) {
    if (amazonStore.url.includes('tag=')) {
      return amazonStore.url.replace(/tag=[^&]+/, `tag=${encodeURIComponent(tag)}`);
    }
    const separator = amazonStore.url.includes('?') ? '&' : '?';
    return `${amazonStore.url}${separator}tag=${encodeURIComponent(tag)}`;
  }

  // Direct search on Amazon with product title and affiliate tag
  const query = encodeURIComponent(product.title);
  return `https://www.amazon.com/s?k=${query}&tag=${encodeURIComponent(tag)}`;
}

/**
 * Builds the direct, verified outbound affiliate URL for any store.
 * Works across all environments: Netlify, Vercel, Cloud Run, GitHub Pages, or local.
 */
export function buildAffiliateUrl(
  product: Product,
  storeName: string = 'Amazon',
  settings?: Partial<AffiliateSettings>
): string {
  const amazonTag = settings?.amazonAssociateId?.trim() || DEFAULT_AMAZON_TAG;
  const cleanStore = storeName.toLowerCase().trim();

  // If Amazon
  if (cleanStore.includes('amazon') || cleanStore === '') {
    return getAmazonAffiliateUrl(product, amazonTag);
  }

  // Find store entry in product if available
  const matchingStore = product.stores?.find(
    s => s.storeName.toLowerCase().trim() === cleanStore
  );

  // If specific URL is configured on the store offer
  if (matchingStore?.url) {
    return matchingStore.url;
  }

  // Best Buy
  if (cleanStore.includes('bestbuy') || cleanStore.includes('best buy')) {
    const query = encodeURIComponent(product.title);
    return `https://www.bestbuy.com/site/searchpage.jsp?st=${query}`;
  }

  // B&H Photo
  if (cleanStore.includes('b&h') || cleanStore.includes('bh photo') || cleanStore.includes('bh')) {
    const query = encodeURIComponent(product.title);
    return `https://www.bhphotovideo.com/c/search?Ntt=${query}`;
  }

  // Target
  if (cleanStore.includes('target')) {
    const query = encodeURIComponent(product.title);
    return `https://www.target.com/s?searchTerm=${query}`;
  }

  // Walmart
  if (cleanStore.includes('walmart')) {
    const query = encodeURIComponent(product.title);
    return `https://www.walmart.com/search?q=${query}`;
  }

  // Default fallback: direct Amazon search with associate tag
  return getAmazonAffiliateUrl(product, amazonTag);
}
