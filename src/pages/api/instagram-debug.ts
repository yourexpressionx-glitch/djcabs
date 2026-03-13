import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check both with and without NEXT_PUBLIC_ prefix for compatibility
    const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      console.error('Instagram Debug Error: Missing Instagram access token. Set INSTAGRAM_ACCESS_TOKEN in .env.local');
      return res.status(500).json({ error: 'Missing Instagram access token' });
    }

    // Fetch with all available fields
    const igRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type,thumbnail_url,caption&access_token=${token}&limit=3`
    );

    if (!igRes.ok) {
      const text = await igRes.text();
      return res.status(igRes.status).json({ error: text });
    }

    const json = await igRes.json();
    
    // Return raw response for debugging
    return res.status(200).json({
      raw: json.data,
      count: json.data?.length || 0,
      processed: (json.data || []).map((post: any) => ({
        id: post.id,
        type: post.media_type,
        has_media_url: !!post.media_url,
        has_thumbnail: !!post.thumbnail_url,
        media_url_sample: post.media_url ? post.media_url.substring(0, 100) : 'N/A',
        thumbnail_url_sample: post.thumbnail_url ? post.thumbnail_url.substring(0, 100) : 'N/A',
      }))
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
