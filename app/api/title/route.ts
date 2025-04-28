import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    try {
      const response = await fetch(validUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkShare/1.0; +https://our-links.vercel.app)'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`)
      }

      const html = await response.text()
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
                             html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)
      
      if (!titleMatch) {
        // If no title found, use the hostname
        const hostname = validUrl.hostname.replace(/^www\./, '')
        const websiteName = hostname.charAt(0).toUpperCase() + hostname.slice(1)
        return NextResponse.json({ 
          title: websiteName,
          description: ''
        })
      }

      return NextResponse.json({ 
        title: titleMatch[1].trim(),
        description: descriptionMatch ? descriptionMatch[1].trim() : ''
      })
    } catch (error) {
      console.error('Error fetching title:', error)
      // Fallback to website name
      const hostname = validUrl.hostname.replace(/^www\./, '')
      const websiteName = hostname.charAt(0).toUpperCase() + hostname.slice(1)
      return NextResponse.json({ 
        title: websiteName,
        description: ''
      })
    }
  } catch (error) {
    console.error('Error in title API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch title' },
      { status: 500 }
    )
  }
} 