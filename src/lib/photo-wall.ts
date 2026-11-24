import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import sharp from 'sharp';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { z } from 'astro/zod';

export const photoEntrySchema = z.object({
  src: z.string().refine(value => value.startsWith('/img/') || /^https:\/\//.test(value), 'src 必须是 /img/ 开头的路径或 HTTPS 图片链接'),
  title: z.string().min(1, '请填写照片标题'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式为 YYYY-MM-DD').optional(),
  alt: z.string().optional(),
  story: z.string().optional(),
  draft: z.boolean().default(false),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  color: z.string().regex(/^#[\da-fA-F]{6}$/, '主色使用 #RRGGBB 格式').optional(),
});

export interface GalleryPhoto {
  n: number;
  id: string;
  title: string;
  album: string;
  year: string;
  alt: string;
  story: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  color: string;
  file?: string;
}

interface ImageInfo { width: number; height: number; color: string; file?: string; }
const cache = resolve('.astro/photo-wall');
const publicDirectory = resolve('public');

async function imageInfo(src: string): Promise<ImageInfo> {
  if (!src.startsWith('/img/')) return { width: 1200, height: 900, color: '#77818d' };
  const file = resolve(publicDirectory, decodeURIComponent(src.split('?')[0]).replace(/^\//, ''));
  if (!file.startsWith(publicDirectory + sep)) throw new Error(`Invalid photo path: ${src}`);
  const info = await stat(file);
  const key = createHash('sha256').update(`${file}:${info.size}:${info.mtimeMs}`).digest('hex');
  const entry = join(cache, `${key}.json`);
  try { return { ...JSON.parse(await readFile(entry, 'utf8')), file }; } catch { /* Generate the cache on first use. */ }
  const image = sharp(file);
  const [metadata, colors] = await Promise.all([image.metadata(), image.clone().rotate().resize(32, 32, { fit: 'inside' }).stats()]);
  const rotated = [5, 6, 7, 8].includes(metadata.orientation || 1);
  const result = {
    width: (rotated ? metadata.height : metadata.width) || 1200,
    height: (rotated ? metadata.width : metadata.height) || 900,
    color: `rgb(${colors.dominant.r} ${colors.dominant.g} ${colors.dominant.b})`,
  };
  await mkdir(cache, { recursive: true });
  await writeFile(entry, JSON.stringify(result));
  return { ...result, file };
}

let memo: { source: string; value: Promise<Awaited<ReturnType<typeof buildPhotoWall>>> } | undefined;
async function buildPhotoWall(source: string) {
  const entries = z.array(photoEntrySchema).parse(JSON.parse(source)).filter(photo => !photo.draft);
  const seen = new Set<string>();
  entries.forEach(photo => {
    if (seen.has(photo.src)) throw new Error(`照片配置中存在重复图片：${photo.src}`);
    seen.add(photo.src);
  });
  const processor = await createMarkdownProcessor({ syntaxHighlight: false });
  const photos: GalleryPhoto[] = [];
  // Only explicitly listed photos are published. No scanning of the old Markdown or image folder.
  for (let start = 0; start < entries.length; start += 4) {
    photos.push(...await Promise.all(entries.slice(start, start + 4).map(async (photo, offset) => {
      const n = start + offset + 1;
      const id = createHash('sha256').update(photo.src).digest('hex').slice(0, 16);
      const info = await imageInfo(photo.src);
      return {
        ...info, n, id, title: photo.title, album: [photo.date, photo.title].filter(Boolean).join(' · '),
        year: photo.date?.slice(0, 4) || '未注明年份', alt: photo.alt || photo.title,
        src: photo.src, thumb: info.file ? `/photo-preview/${id}.webp` : photo.src,
        width: photo.width || info.width, height: photo.height || info.height, color: photo.color || info.color,
        story: photo.story ? (await processor.render(photo.story)).code : '',
      };
    })));
  }
  return { photos };
}

export async function loadPhotoWall() {
  const source = await readFile(resolve('src/data/photos.json'), 'utf8');
  if (!memo || memo.source !== source) memo = { source, value: buildPhotoWall(source) };
  return memo.value;
}

export async function photoThumbnail(file: string) {
  const info = await stat(file);
  const key = createHash('sha256').update(`thumb-v1:${file}:${info.size}:${info.mtimeMs}`).digest('hex');
  const path = join(cache, `${key}.webp`);
  try { return await readFile(path); } catch { /* Originals stay untouched; generated previews are ignored by Git. */ }
  const buffer = await sharp(file).rotate().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 76 }).toBuffer();
  await mkdir(cache, { recursive: true });
  await writeFile(path, buffer);
  return buffer;
}
