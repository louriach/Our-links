import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { url } = await request.json()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Fetch URL metadata with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(validUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkShare/1.0)',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()

      // Basic metadata extraction
      const title = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || ''
      const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/)?.[1] ||
                         html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/)?.[1] || ''
      
      // Open Graph metadata
      const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/)?.[1] || title
      const ogDescription = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/)?.[1] || description
      const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/)?.[1] || ''
      
      // Favicon
      const favicon = html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/)?.[1] ||
                     html.match(/<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"[^>]*>/)?.[1] ||
                     new URL('/favicon.ico', validUrl).href

      clearTimeout(timeoutId)

      return NextResponse.json({
        title: ogTitle || validUrl.hostname,
        description: ogDescription || '',
        image: ogImage,
        favicon: favicon.startsWith('http') ? favicon : new URL(favicon, validUrl).href
      })
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return NextResponse.json({ error: 'Request timeout' }, { status: 408 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      throw error
    }
  } catch (error) {
    console.error('Error unfurling URL:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unfurl URL' },
      { status: 500 }
    )
  }
} 