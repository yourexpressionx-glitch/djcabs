// src/pages/api/instagram.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type InstagramPost = {
  id: string;
  media_url: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
};

type Data = {
  posts: InstagramPost[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
  try {
    // Check both with and without NEXT_PUBLIC_ prefix for compatibility
    const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      console.error('Instagram API Error: Missing Instagram access token. Set INSTAGRAM_ACCESS_TOKEN in .env.local');
      return res.status(500).json({ error: 'Missing Instagram access token' });
    }

    const igRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type,thumbnail_url&access_token=${token}`
    );

    if (!igRes.ok) {
      const text = await igRes.text();
      console.error(text);
      return res
        .status(igRes.status)
        .json({ error: 'Failed to fetch from Instagram' });
    }

    const json = await igRes.json();

    const posts: InstagramPost[] = (json.data ?? []).map((post: any) => {
      // For videos, Instagram API returns: id, media_type, permalink, thumbnail_url (optional)
      // For images, Instagram API returns: id, media_type, media_url, permalink
      let media_url = post.media_url || '';
      
      // For videos without media_url, try to use thumbnail_url
      if (!media_url && post.media_type === 'VIDEO' && post.thumbnail_url) {
        media_url = post.thumbnail_url;
      }
      
      return {
        id: post.id,
        media_url: media_url,
        permalink: post.permalink,
        media_type: post.media_type || 'IMAGE',
        thumbnail_url: post.thumbnail_url
      };
    }).filter((post: InstagramPost) => post.media_url).slice(0, 6);

    // Log for debugging
    console.log('Instagram posts fetched:', posts.length);
    posts.forEach((p, i) => {
      console.log(`Post ${i+1}: type=${p.media_type}, url_length=${p.media_url.length}`);
    });

    return res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
