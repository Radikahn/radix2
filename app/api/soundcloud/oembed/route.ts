import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackUrl = searchParams.get('url');

    if (!trackUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // Use SoundCloud's oEmbed API
    const oembedUrl = new URL('https://soundcloud.com/oembed');
    oembedUrl.searchParams.set('url', trackUrl);
    oembedUrl.searchParams.set('format', 'json');

    // Forward additional parameters
    const maxwidth = searchParams.get('maxwidth');
    const maxheight = searchParams.get('maxheight');
    const color = searchParams.get('color');
    const auto_play = searchParams.get('auto_play');
    const show_comments = searchParams.get('show_comments');

    if (maxwidth) oembedUrl.searchParams.set('maxwidth', maxwidth);
    if (maxheight) oembedUrl.searchParams.set('maxheight', maxheight);
    if (color) oembedUrl.searchParams.set('color', color);
    if (auto_play) oembedUrl.searchParams.set('auto_play', auto_play);
    if (show_comments) oembedUrl.searchParams.set('show_comments', show_comments);

    const response = await fetch(oembedUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'SoundCloud oEmbed API request failed', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('SoundCloud oEmbed proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
