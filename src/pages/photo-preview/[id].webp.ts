import type { APIContext } from 'astro';
import { loadPhotoWall, photoThumbnail } from '../../lib/photo-wall';

export async function getStaticPaths() {
  return (await loadPhotoWall()).photos.filter(photo => photo.file).map(photo => ({ params: { id: photo.id }, props: { file: photo.file! } }));
}

export async function GET({ props }: APIContext) {
  const buffer = await photoThumbnail(props.file);
  return new Response(new Uint8Array(buffer), { headers: { 'Content-Type': 'image/webp' } });
}
