<!-- # SuperoAgrobase - Complete SEO Implementation Guide

## 🎯 What Changed in the Refactoring

### ✅ Before vs After

#### Before (Multiple Functions):
```javascript
generateHomeMetadata()
generateAboutMetadata()
generateContactMetadata()
generateAllProductsMetadata()
generateCategoryMetadata()
// ... 10+ different functions
```

#### After (Unified Function):
```javascript
// One powerful function for everything
generateMetadata({
  title: "Your Title",
  description: "Your description",
  path: "/your-path",
  keywords: ['keyword1', 'keyword2'],
  // ... all options
})

// Plus convenient helpers that use it internally
getHomeMetadata()
getAboutMetadata()
// ... etc
```

---

## 🏗️ Architecture Overview

### File Structure
```
utils/
├── seo-metadata.js          # Main unified SEO system
└── product-metadata.js      # Product-specific (your existing file)

app/
├── layout.js                # Root layout with SITE_DATE
├── page.js                  # Homepage with SEO
├── about/page.js
├── contact/page.js
├── products/
│   ├── page.js              # All products
│   ├── [slug]/page.js       # Single product
│   └── categories/
│       ├── [slug]/page.js   # Category
│       └── [categorySlug]/[subcategorySlug]/page.js
├── services/page.js
├── blog/[slug]/page.js
├── sitemap.js               # Dynamic sitemap
└── robots.js                # Dynamic robots.txt
```

---

## 📦 SITE_DATE - Single Source of Truth

### Benefits
✅ **No hardcoding** - All values in one place
✅ **Easy updates** - Change once, applies everywhere
✅ **Type safety** - Structured data prevents errors
✅ **Consistency** - Same info across all pages

### What's Included
```javascript
SITE_DATE = {
  // Business Info
  name: 'SuperoAgrobase'
  legalName: 'Supero Incorporation Limited'
  tagline: 'Key to Agricultural Productivity'

  // Contact
  phone: '+2348157037737'
  email: 'contact@superoagrobase.com'
  whatsapp: 'https://wa.me/message/KK2QPDR6KTLBK1'

  // Location
  address: { /* full address details */ }
  geo: { latitude, longitude }

  // Descriptions (short, medium, long)
  descriptions: { /* 3 versions */ }

  // Social Media
  social: { facebook, instagram, twitter, whatsapp }

  // Assets
  assets: { logo, ogImage, favicon }

  // SEO Keywords (primary, secondary, locations)
  keywords: { /* organized by type */ }

  // Business Hours & More
}
```

---

## 🚀 The Unified `generateMetadata()` Function

### Core Philosophy
**One function to rule them all** - accepts options, returns metadata.

### Available Options

```javascript
generateMetadata({
  // Page Type
  pageType: 'website' | 'article',

  // Core Content
  title: string,              // Will be templated with site name
  description: string,         // Falls back to site description
  keywords: string[],         // Combined with site keywords

  // URL & Path
  path: string,               // e.g., '/about'
  canonical: string,          // Override canonical URL

  // Images
  images: Array<string | {
    url: string,
    width: number,
    height: number,
    alt: string
  }>,

  // Page-specific Data
  data: {
    publishedTime: string,    // For articles
    modifiedTime: string,
    authors: string[],
    tags: string[]
  },

  // Pagination
  pagination: {
    prev: string,
    next: string
  },

  // Indexing Control
  index: boolean,             // Default: true
  follow: boolean,            // Default: true

  // Additional Metadata
  additionalMetadata: object  // Merge extra fields
})
```

### Example Usage

#### Simple Page
```javascript
export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about our company',
  path: '/about'
});
```

#### Complex Page
```javascript
export const metadata = generateMetadata({
  pageType: 'article',
  title: 'How to Grow Maize in Nigeria',
  description: 'Complete guide...',
  path: '/blog/how-to-grow-maize',
  keywords: ['maize farming', 'Nigeria agriculture'],
  images: [{
    url: '/blog/maize-guide.jpg',
    alt: 'Maize farming guide'
  }],
  data: {
    publishedTime: '2024-01-15',
    authors: ['John Farmer'],
    tags: ['farming', 'maize', 'guide']
  }
});
```

---

## 🎨 Helper Functions for Common Pages

For convenience, we've created helpers for common pages:

```javascript
// These internally use generateMetadata() with preset values

getHomeMetadata()
getAboutMetadata()
getContactMetadata()
getProductsMetadata({ page, totalProducts })
getCategoryMetadata(category, { page, totalProducts })
getSubcategoryMetadata(category, subcategory, options)
getServicesMetadata()
getBlogMetadata(article)
getSearchMetadata(query, { totalResults })
```

**When to use helpers vs generateMetadata():**
- **Use helpers** for standard pages (home, about, contact, etc.)
- **Use generateMetadata()** for custom/unique pages

---

## 📊 JSON-LD Schema Functions

Separate functions for structured data:

```javascript
// Global schemas (used in layout)
getOrganizationJsonLd()
getWebSiteJsonLd()

// Page-specific schemas
getLocalBusinessJsonLd()
getBreadcrumbJsonLd(items)

// Custom schemas (build yourself)
// See examples in usage guide
```

---

## 🔧 Implementation Steps

### Step 1: Update Site Config
```javascript
// File: utils/seo-metadata.js
// Update SITE_DATE with your actual data

export const SITE_DATE = {
  // ... your actual information
  verification: {
    google: 'PASTE-YOUR-GOOGLE-CODE-HERE',
    bing: 'PASTE-YOUR-BING-CODE-HERE',
    facebook: 'YOUR-FB-APP-ID'
  }
};
```

### Step 2: Test Your Pages

#### Test Homepage
```bash
npm run dev
# Visit: http://localhost:3000
# View source and check:
# - <title> tag
# - meta description
# - Open Graph tags
# - JSON-LD scripts
```

#### Test with Tools
1. **Rich Results Test**
   https://search.google.com/test/rich-results
   Paste your live URL

2. **Open Graph Debugger**
   https://developers.facebook.com/tools/debug/
   Test social sharing

3. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator
   Test Twitter cards

### Step 3: Deploy & Verify

```bash
# 1. Build production
npm run build

# 2. Test production build locally
npm run start

# 3. Deploy to production
# (Your deployment process)

# 4. Submit sitemap to Google
# https://search.google.com/search-console
# Add property → Sitemaps → Submit:
# https://superoagrobase.com/sitemap.xml
```

---

## 📱 Complete Page Examples

### Example 1: Custom Landing Page
```javascript
// File: app/landing/black-friday/page.js
import { generateMetadata, SITE_DATE } from "@/utils/seo-metadata";

export const metadata = generateMetadata({
  title: 'Black Friday Sale - Up to 50% Off Agricultural Products',
  description: `Massive Black Friday discounts at ${SITE_DATE.name}! Save up to 50% on seeds, fertilizers, equipment & more. Limited time offer. Shop now!`,
  path: '/landing/black-friday',
  keywords: [
    'black friday sale',
    'agricultural products discount',
    'farming supplies sale Nigeria',
    'seeds discount',
    'fertilizer sale'
  ],
  images: [{
    url: '/landing/black-friday-og.jpg',
    width: 1200,
    height: 630,
    alt: 'Black Friday Sale - SuperoAgrobase'
  }],
  index: true,  // Yes, index this promotional page
  follow: true
});

export default function BlackFridayPage() {
  return <div>{/* Your landing page */}</div>;
}
```

### Example 2: Location-Specific Page
```javascript
// File: app/locations/lagos/page.js
export const metadata = generateMetadata({
  title: 'Agricultural Products in Lagos - Fast Delivery',
  description: `Buy quality agricultural products in Lagos. ${SITE_DATE.name} offers fast same-day delivery across Lagos State. Seeds, fertilizers, equipment & more. Order now!`,
  path: '/locations/lagos',
  keywords: [
    'agricultural products Lagos',
    'farm supplies Lagos',
    'seeds Lagos Nigeria',
    'fertilizer Lagos',
    'Lagos agro dealer'
  ],
  additionalMetadata: {
    // Custom meta tags for location
    other: {
      'geo.region': 'NG-LA',
      'geo.placename': 'Lagos',
      'geo.position': '6.5244;3.3792'
    }
  }
});
```

### Example 3: Seasonal Campaign
```javascript
// File: app/campaigns/rainy-season-2024/page.js
export const metadata = generateMetadata({
  title: 'Rainy Season Farming Guide 2024 - Best Seeds & Fertilizers',
  description: 'Complete guide for rainy season farming in Nigeria. Discover best seeds, fertilizers & equipment. Expert tips + special discounts. Plan your farm today!',
  path: '/campaigns/rainy-season-2024',
  keywords: [
    'rainy season farming Nigeria',
    'wet season crops',
    'farming guide 2024',
    'best seeds rainy season',
    'fertilizer rainy season'
  ]
});
```

---

## 🎯 SEO Best Practices with Your New System

### 1. Dynamic Keywords
```javascript
// Combine site keywords with page-specific ones
generateMetadata({
  title: 'Maize Seeds',
  keywords: [
    'maize seeds',           // Page-specific
    'hybrid maize',
    'improved maize varieties'
    // SITE_DATE.keywords are auto-added!
  ]
})
```

### 2. Smart Pagination
```javascript
// Categories with pagination
getCategoryMetadata(category, {
  page: 2,
  totalProducts: 150
});

// Automatically generates:
// - Title: "Buy Seeds - Page 2 | 150 Products"
// - Canonical: base URL
// - Prev/Next links for Google
```

### 3. Consistent Branding
```javascript
// All pages automatically get:
// - Site name in title
// - Site description as fallback
// - Site logo in Open Graph
// - Consistent contact info
// - Social media links
```

### 4. Location Targeting
```javascript
// Keywords automatically include locations
SITE_DATE.keywords.locations // ['Ikorodu', 'Lagos', 'Ibadan', ...]

// Your pages automatically rank for:
// - "agricultural products Ikorodu"
// - "farm supplies Lagos"
// - etc.
```

---

## 🔍 Monitoring & Analytics

### Google Search Console Setup

1. **Add Property**
   - Go to: https://search.google.com/search-console
   - Add property: `superoagrobase.com`
   - Verify using code in SITE_DATE.verification.google

2. **Submit Sitemap**
   ```
   https://superoagrobase.com/sitemap.xml
   ```

3. **Monitor Weekly**
   - Total clicks & impressions
   - Average position
   - Click-through rate (CTR)
   - Coverage issues

### Key Metrics to Track

```javascript
// Track these in Google Analytics
{
  organicTraffic: '+20% MoM target',
  conversionRate: '2-5% target',
  avgSessionDuration: '3+ minutes',
  bounceRate: '<50%',
  pageLoadTime: '<2 seconds',
  mobileTraffic: '60%+ in Nigeria'
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Missing Verification Codes
**Problem:** Metadata doesn't appear in search results
**Solution:**
```javascript
// Update in utils/seo-metadata.js
verification: {
  google: 'YOUR-ACTUAL-CODE-HERE',  // ❌ Not placeholder
  bing: 'YOUR-ACTUAL-CODE-HERE'
}
```

### Issue 2: Duplicate Content
**Problem:** Same content, different URLs
**Solution:**
```javascript
// Always set canonical URLs
generateMetadata({
  canonical: 'https://superoagrobase.com/correct-url'
})
```

### Issue 3: Slow Page Load
**Problem:** Too many images/scripts
**Solution:**
```javascript
// Optimize images
import Image from 'next/image'
<Image
  src={product.image}
  width={600}
  height={600}
  priority={isFeatured}
  loading="lazy"
/>
```

### Issue 4: Mobile Issues
**Problem:** Not mobile-friendly
**Solution:** Already handled in root layout!
```javascript
viewport: {
  width: 'device-width',
  initialScale: 1,
  // ... optimized settings
}
```

---

## 📈 Expected Results Timeline

### Week 1-2: Foundation
- ✅ Metadata appears in search
- ✅ Rich snippets start showing
- ✅ Social sharing works perfectly

### Week 3-4: Indexing
- 📊 Pages getting indexed
- 📊 Appearing for brand searches
- 📊 Rich results in Google

### Month 2-3: Rankings
- 📈 Ranking for long-tail keywords
- 📈 Organic traffic increasing
- 📈 Click-through rate improving

### Month 4-6: Growth
- 🚀 Top 10 for main keywords
- 🚀 Consistent organic traffic
- 🚀 Conversions from SEO

---

## ✅ Launch Checklist

### Pre-Launch
- [ ] Updated SITE_DATE with real data
- [ ] Added verification codes
- [ ] Tested all page types locally
- [ ] Checked JSON-LD with validators
- [ ] Optimized all images
- [ ] Set up Google Analytics

### Launch Day
- [ ] Deploy to production
- [ ] Verify live site metadata
- [ ] Submit sitemap to Google
- [ ] Test social sharing
- [ ] Check mobile performance
- [ ] Monitor for errors

### Post-Launch (Week 1)
- [ ] Google Search Console setup
- [ ] Monitor indexing status
- [ ] Check for crawl errors
- [ ] Verify rich results
- [ ] Start tracking rankings
- [ ] Begin content marketing

---

## 🎓 Pro Tips

### 1. Content is King
```markdown
No amount of SEO will help poor content.
Focus on:
- Unique product descriptions (300+ words)
- Helpful blog posts (1000+ words)
- Customer reviews (encourage them!)
- High-quality images
```

### 2. Update Regularly
```javascript
// Refresh metadata quarterly
SITE_DATE.descriptions.long = "Updated description with latest stats..."
```

### 3. Local SEO
```javascript
// Emphasize your location
- Add location pages (/locations/lagos)
- Use location in keywords
- Get Google Business Profile
- Encourage local reviews
```

### 4. Mobile First
```javascript
// 60%+ traffic from mobile in Nigeria
- Fast loading (< 2s)
- Touch-friendly buttons
- Readable text (16px+)
- Optimized images
```

---

## 🎉 You're All Set!

Your SEO foundation is now:
✅ **Unified** - One function for all metadata
✅ **Centralized** - SITE_DATE for all values
✅ **Flexible** - Easy to customize per page
✅ **Powerful** - Rich results & social sharing
✅ **Maintainable** - Change once, apply everywhere

### Quick Reference Card

```javascript
// For standard pages
export const metadata = getHomeMetadata()

// For custom pages
export const metadata = generateMetadata({
  title: 'Your Title',
  path: '/your-path',
  keywords: ['keyword1', 'keyword2']
})

// For dynamic pages
export async function generateMetadata({ params }) {
  const data = await fetchData(params.slug)
  return getCategoryMetadata(data)
}

// Always use SITE_DATE
import { SITE_DATE } from '@/utils/seo-metadata'
console.log(SITE_DATE.phone) // +2348157037737
```

---

## 🤝 Support & Resources

**Need Help?**
- Check error logs in Next.js console
- Test with Google's Rich Results Test
- Review Next.js metadata docs
- Ask in Next.js Discord

**Useful Tools:**
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Schema Validator](https://validator.schema.org)

---

## 🚀 Next Steps

1. **Implement** the code from artifacts
2. **Test** each page type
3. **Deploy** to production
4. **Monitor** results weekly
5. **Optimize** based on data
6. **Scale** your content strategy

**Remember:** SEO is a marathon, not a sprint. Focus on creating valuable content for Nigerian farmers, and the rankings will follow! 🌾

---

*SuperoAgrobase - Key to Agricultural Productivity* 🇳🇬 -->

based on the recent update, update my webmanifest and make it standard

```json
{
  "name": "",
  "short_name": "",
  "icons": [
    {
      "src": "/favicon/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicon/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```
