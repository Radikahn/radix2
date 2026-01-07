import { NextRequest, NextResponse } from 'next/server';

const SOUNDCLOUD_CLIENT_ID = 'nIjtjiYnjkOhMyh5xrbqEW12DxeJVnic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint') || 'me';

    // Build the SoundCloud API URL
    const soundcloudUrl = new URL(`https://api-widget.soundcloud.com/${endpoint}`);
    soundcloudUrl.searchParams.set('client_id', SOUNDCLOUD_CLIENT_ID);

    // Forward any additional query parameters
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        soundcloudUrl.searchParams.set(key, value);
      }
    });

    // Fetch from SoundCloud API
    const response = await fetch(soundcloudUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'SoundCloud API request failed', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('SoundCloud proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
