type Photo = { n: number; title: string; album: string; alt: string; src: string; thumb: string; color: string; year: string; story: string };
const root = document.querySelector<HTMLElement>('#photo-gallery')!;
const photos: Photo[] = JSON.parse(root.querySelector('#photo-data')!.textContent || '[]');
const query = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
const all = <T extends HTMLElement = HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];
const pad = (n: number) => String(n).padStart(2, '0');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const roll = query('#roll');
const table = query('#table');
const viewer = query<HTMLDialogElement>('#photo-viewer');
const image = query<HTMLImageElement>('#v-img');
const loading = query('#v-loading');
const story = query('#v-story');
const strip = query('#v-strip');
let selected = [...photos];
let current = 1;
let view = 'roll';
let page = 0;
let z = 1;
let suppressUntil = 0;
let draggedPrint: HTMLElement | undefined;
let pointerStart: { x: number; y: number } | undefined;
const pageSize = () => matchMedia('(max-width: 640px)').matches ? 8 : 18;

function setImageSource(element: HTMLImageElement) {
  if (element.dataset.src && !element.getAttribute('src')) element.src = element.dataset.src;
}

function show(n: number) {
  const photo = photos.find(item => item.n === n);
  if (!photo) return;
  current = n;
  image.classList.remove('in'); loading.hidden = false;
  loading.textContent = '照片载入中…';
  query('#v-stage').style.setProperty('--c', photo.color);
  image.onload = () => { image.classList.add('in'); loading.hidden = true; };
  image.onerror = () => { loading.textContent = '照片暂时未能加载，请稍后重试'; };
  image.alt = photo.alt; image.src = photo.src;
  // Cached images may already have completed before the load handler runs.
  if (image.complete && image.naturalWidth) { image.classList.add('in'); loading.hidden = true; }
  const position = selected.findIndex(item => item.n === n) + 1;
  query('#v-count').textContent = `${pad(position)} / ${pad(selected.length)}`;
  query('#v-title').textContent = photo.album;
  story.hidden = !photo.story; story.innerHTML = photo.story; story.scrollTop = 0;
  all<HTMLButtonElement>('.sthumb').forEach(button => {
    const active = Number(button.dataset.go) === n;
    button.classList.toggle('on', active);
    if (active) {
      button.setAttribute('aria-current', 'true');
      button.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'instant' : 'smooth' });
    } else button.removeAttribute('aria-current');
  });
  // Load nearby previews only; full original images are requested on selection.
  const index = selected.findIndex(item => item.n === n);
  selected.slice(Math.max(0, index - 5), index + 6).forEach(item => {
    const thumbnail = strip.querySelector<HTMLImageElement>(`[data-go="${item.n}"] img`);
    if (thumbnail) setImageSource(thumbnail);
  });
  history.replaceState(null, '', `${location.pathname}${location.search}#photo-${pad(n)}`);
}

function open(n: number) {
  if (!photos.some(photo => photo.n === n)) return;
  if (!selected.some(photo => photo.n === n)) filter('all');
  if (!viewer.open) { viewer.showModal(); document.documentElement.classList.add('photo-viewer-open'); }
  show(n);
}

function step(direction: number) {
  if (!selected.length) return;
  const index = selected.findIndex(photo => photo.n === current);
  show(selected[(index + direction + selected.length) % selected.length].n);
}

query('#v-close').addEventListener('click', () => viewer.close());
query('#v-prev').addEventListener('click', () => step(-1));
query('#v-next').addEventListener('click', () => step(1));
viewer.addEventListener('close', () => {
  document.documentElement.classList.remove('photo-viewer-open');
  if (/^#photo-\d+$/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
});
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
});
query('#v-stage').addEventListener('pointerdown', event => {
  if ((event.target as Element).closest('button')) return;
  pointerStart = { x: event.clientX, y: event.clientY };
});
query('#v-stage').addEventListener('pointerup', event => {
  if (!pointerStart) return;
  const dx = event.clientX - pointerStart.x; const dy = event.clientY - pointerStart.y;
  pointerStart = undefined;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  else if (event.target === event.currentTarget && Math.abs(dx) < 6 && Math.abs(dy) < 6) viewer.close();
});
query('#v-stage').addEventListener('pointercancel', () => { pointerStart = undefined; });
strip.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>('[data-go]');
  if (button) show(Number(button.dataset.go));
});
root.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>('[data-open]');
  if (!button || viewer.contains(button)) return;
  if (button === draggedPrint && performance.now() < suppressUntil) { event.preventDefault(); return; }
  open(Number(button.dataset.open));
});

function scatter(animate: boolean) {
  const visible = all<HTMLElement>('.print').filter(print => !print.hidden);
  const columns = Math.max(2, Math.floor(table.clientWidth / (visible[0]?.offsetWidth + 18 || 200)));
  const rows = Math.ceil(visible.length / columns);
  visible.forEach((print, index) => {
    const maxX = Math.max(0, table.clientWidth - print.offsetWidth - 22);
    const maxY = Math.max(0, table.clientHeight - print.offsetHeight - 22);
    const x = Math.max(10, Math.min(maxX, ((index % columns) / Math.max(1, columns - 1)) * maxX + Math.random() * 25 - 12));
    const y = Math.max(10, Math.min(maxY, (Math.floor(index / columns) / Math.max(1, rows - 1)) * maxY + Math.random() * 25 - 12));
    print.style.transition = animate && !reduceMotion ? 'left .5s, top .5s, transform .5s' : 'none';
    print.style.left = `${x}px`; print.style.top = `${y}px`;
    print.style.setProperty('--r', `${Math.random() * 12 - 6}deg`);
  });
}

function renderTable(animate = false) {
  const size = pageSize(); const total = Math.ceil(selected.length / size);
  page = Math.max(0, Math.min(page, total - 1));
  const visible = new Set(selected.slice(page * size, (page + 1) * size).map(photo => photo.n));
  all('.print').forEach(print => {
    print.hidden = !visible.has(Number(print.dataset.n));
    if (!print.hidden) setImageSource(print.querySelector<HTMLImageElement>('img')!);
  });
  query('#table-page').textContent = selected.length ? `${page + 1} / ${total} 组 · ${selected.length} 张照片` : '尚无照片';
  query<HTMLButtonElement>('#table-previous').disabled = page === 0;
  query<HTMLButtonElement>('#table-next').disabled = !selected.length || page === total - 1;
  requestAnimationFrame(() => scatter(animate));
}

function filter(year: string) {
  selected = photos.filter(photo => year === 'all' || photo.year === year); page = 0;
  all<HTMLButtonElement>('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === year)));
  all<HTMLElement>('.frame, .memory-stop[data-year], .sthumb').forEach(element => { element.hidden = year !== 'all' && element.dataset.year !== year; });
  query('#gallery-status').textContent = `${year === 'all' ? '全部' : year} · ${selected.length} 张照片`;
  query('#index-count').textContent = `${pad(selected.length)} 枚光影`;
  if (view === 'table') renderTable();
}

query('.year-filter').addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-filter]');
  if (button) filter(button.dataset.filter!);
});
query('.views').addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-view]');
  if (!button) return;
  view = button.dataset.view!; const tabletop = view === 'table';
  roll.hidden = tabletop; table.hidden = !tabletop;
  query('#shuffle').hidden = !tabletop; query('#table-pagination').hidden = !tabletop;
  all<HTMLButtonElement>('[data-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  query('#hint').textContent = tabletop ? '拖动照片 · 点一下看大图 · 分组慢慢翻' : '点照片看大图 · ← → 切换';
  if (tabletop) renderTable();
});
query('#shuffle').addEventListener('click', () => scatter(true));
query('#table-previous').addEventListener('click', () => { page--; renderTable(); });
query('#table-next').addEventListener('click', () => { page++; renderTable(); });
all('.memory-stop[data-open]').forEach(stop => {
  const highlight = (active: boolean) => roll.querySelector(`[data-n="${stop.dataset.open}"]`)?.classList.toggle('lit', active);
  stop.addEventListener('mouseenter', () => highlight(true)); stop.addEventListener('mouseleave', () => highlight(false));
  stop.addEventListener('focus', () => highlight(true)); stop.addEventListener('blur', () => highlight(false));
});

all<HTMLElement>('.print').forEach(print => {
  let start: { x: number; y: number; left: number; top: number; moved: boolean } | undefined;
  print.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    start = { x: event.clientX, y: event.clientY, left: print.offsetLeft, top: print.offsetTop, moved: false };
    print.setPointerCapture(event.pointerId); print.style.transition = 'none'; print.style.zIndex = String(++z); print.classList.add('lift');
  });
  print.addEventListener('pointermove', event => {
    if (!start) return;
    const dx = event.clientX - start.x; const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > 5) start.moved = true;
    print.style.left = `${Math.max(8, Math.min(table.clientWidth - print.offsetWidth - 8, start.left + dx))}px`;
    print.style.top = `${Math.max(8, Math.min(table.clientHeight - print.offsetHeight - 8, start.top + dy))}px`;
  });
  const end = () => { if (start?.moved) { draggedPrint = print; suppressUntil = performance.now() + 250; } start = undefined; print.classList.remove('lift'); };
  print.addEventListener('pointerup', end); print.addEventListener('pointercancel', end); print.addEventListener('lostpointercapture', end);
});
let resizeFrame = 0;
window.addEventListener('resize', () => { if (view !== 'table') return; cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => renderTable()); });
const fromHash = () => {
  const match = location.hash.match(/^#photo-(\d+)$/);
  if (match) open(Number(match[1])); else if (viewer.open) viewer.close();
};
fromHash(); window.addEventListener('hashchange', fromHash);
const thumbnailObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) setImageSource(entry.target as HTMLImageElement); });
}, { root: strip, rootMargin: '0px 160px' });
strip.querySelectorAll<HTMLImageElement>('img').forEach(thumbnail => thumbnailObserver.observe(thumbnail));
