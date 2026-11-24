import { allPosts, postUrl, dateLabel } from '../lib/posts';
export async function GET() { return Response.json((await allPosts()).map(post => ({ title: post.data.title, url: postUrl(post), date: dateLabel(post), tags: [...post.data.tags, ...post.data.categories], text: (post.body || '').replace(/<[^>]+>|\{%[\s\S]*?%\}/g, '') }))); }
