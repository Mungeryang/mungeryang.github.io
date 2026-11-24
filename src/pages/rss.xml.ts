import rss from '@astrojs/rss';
import { allPosts, postUrl, excerpt } from '../lib/posts';
import type { APIContext } from 'astro';
export async function GET(context: APIContext) { return rss({ title: 'munger写字的地方', description: 'slow is fast · 技术探索、科研心路与生活记录', site: context.site!, items: (await allPosts()).map(post => ({ title: post.data.title, pubDate: new Date(post.data.date), link: postUrl(post), description: excerpt(post, 200) })), customData: '<language>zh-cn</language>' }); }
