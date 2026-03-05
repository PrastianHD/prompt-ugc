import { NextRequest, NextResponse } from 'next/server'
import type { ScrapedProduct } from '@/lib/types'

// ─── Shopee Scraper ────────────────────────────────────────────────────────────
// Mengekstrak shopid + itemid dari berbagai format URL Shopee,
// lalu memanggil Shopee internal API untuk mendapatkan data produk.

function extractShopeeIds(url: string): { shopId: string; itemId: string } | null {
  const patterns = [
    /product\/(\d+)\/(\d+)/,
    /-i\.(\d+)\.(\d+)/,
    /\/(\d+)\/(\d+)(?:\?|$)/,
  ]
  for (const pat of patterns) {
    const m = url.match(pat)
    if (m) return { shopId: m[1], itemId: m[2] }
  }
  return null
}

async function scrapeViaShopeeApi(shopId: string, itemId: string): Promise<ScrapedProduct | null> {
  const apiUrl = `https://shopee.co.id/api/v4/item/get?itemid=${itemId}&shopid=${shopId}`
  
  const res = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'X-Forwarded-For': `66.249.66.1`,
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) return null

  const json = await res.json()
  const item = json?.data

  if (!item) return null

  // Extract image URLs - Shopee uses CDN with image hashes
  const images: string[] = []
  if (item.images?.length) {
    item.images.slice(0, 5).forEach((hash: string) => {
      images.push(`https://down-id.img.susercontent.com/file/${hash}`)
    })
  } else if (item.image) {
    images.push(`https://down-id.img.susercontent.com/file/${item.image}`)
  }

  // Category parsing
  const cats: string[] = []
  if (item.categories?.length) {
    item.categories.forEach((c: any) => cats.push(c.display_name || c.name || ''))
  } else if (item.fe_categories?.length) {
    item.fe_categories.forEach((c: any) => cats.push(c.display_name || c.name || ''))
  }
  const category = cats.filter(Boolean).join(' > ') || 'Lainnya'

  // Clean description
  let description = item.description || ''
  description = description
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]{2,}/g, ' ')
    .slice(0, 800)

  return {
    name: item.name || 'Produk Shopee',
    description,
    category,
    imageUrls: images,
    price: item.price ? `Rp ${(item.price / 100000).toLocaleString('id-ID')}` : undefined,
    rating: item.item_rating?.rating_star?.toFixed(1),
    shopName: item.shop_name || undefined,
    productLink: `https://shopee.co.id/product/${shopId}/${itemId}`,
  }
}

async function scrapeViaHtmlFallback(url: string): Promise<ScrapedProduct | null> {
  // Fallback: fetch HTML lalu ekstrak meta OG tags
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) return null
  const html = await res.text()

  const ogTitle = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1] || ''
  const ogDesc = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)?.[1] || ''
  const ogImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1] || ''
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || ''

  const name = ogTitle || title.split('|')[0].trim() || 'Produk Shopee'
  const description = ogDesc || ''
  const images = ogImage ? [ogImage] : []

  if (!name) return null

  return {
    name,
    description,
    category: 'Lainnya',
    imageUrls: images,
    productLink: url,
  }
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL tidak valid' }, { status: 400 })
    }

    // Normalize URL - handle mobile/short links
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http')) normalizedUrl = 'https://' + normalizedUrl

    // Extract IDs
    const ids = extractShopeeIds(normalizedUrl)
    
    let product: ScrapedProduct | null = null

    if (ids) {
      // Primary: Shopee API
      product = await scrapeViaShopeeApi(ids.shopId, ids.itemId)
    }

    if (!product) {
      // Fallback: HTML scraping
      product = await scrapeViaHtmlFallback(normalizedUrl)
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data produk. Pastikan link Shopee valid.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (err: any) {
    console.error('[scrape] error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}