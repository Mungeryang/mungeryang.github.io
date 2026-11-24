# 照片墙操作模板

照片墙入口为 `/picture/`，参考 Jerry's Blog 的黑色相框胶卷、主色条、可拖动桌面和大图查看器。

照片列表只读取 `src/data/photos.json`。目前是空数组 `[]`，没有导入旧照片墙的 152 张照片。原来的 `source/picture/index.md` 和本地照片仍然保留，修改旧 Markdown 不会影响这个新版照片模板。

## 添加一张照片

打开 `src/data/photos.json`，把 `[]` 替换成下面的内容，将 `src` 改为自己的真实图片链接：

```json
[
  {
    "src": "https://你的图片域名/旅行/日落.jpg",
    "title": "海边日落",
    "date": "2026-11-24",
    "story": "散步到海边，刚好遇见日落。"
  }
]
```

为了保持图片不进入 GitHub 的使用方式，推荐先将照片上传到自己的图床或 OSS，再填写可公开访问的 HTTPS 图片链接。只保存图片链接不会把图片文件上传到 GitHub；本次没有新建或配置图床服务。

也支持已存在的本地图片路径，例如 `/img/life/suzhou3.jpeg`。新增本地图片放在 `public/img/gallery/`，对应地址 `/img/gallery/照片名.jpg`。但如果只把新文件留在电脑上，GitHub/Vercel 的远程构建无法取得它，线上会缺图；需要独立上传到图片存储，或明确选择提交该张照片。不要把“不提交本地图片”等同于“网站自动获得图片”。

## 添加多张照片

数组中的每个 `{ ... }` 就是一张照片，条目之间用英文逗号分隔，最后一个条目后不加逗号：

```json
[
  {
    "src": "https://你的图片域名/日落.jpg",
    "title": "海边日落",
    "date": "2026-11-24",
    "story": "第一张照片的故事。"
  },
  {
    "src": "https://你的图片域名/山路.jpg",
    "title": "山间徒步",
    "date": "2026-11-25",
    "story": "第二张照片的故事。"
  }
]
```

页面按列表顺序展示。调整条目的先后即可排序；年份筛选会根据 `date` 自动生成。完整字段示例在 `src/data/photos.example.json`，这个示例文件不会被展示。

## 可用字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `src` | 是 | HTTPS 图片地址，或 `/img/` 开头的已有本地图片路径 |
| `title` | 是 | 相框标题 |
| `date` | 否 | `YYYY-MM-DD`，用于年份筛选和大图标题 |
| `story` | 否 | 点开大图后展示的文字，支持 Markdown |
| `alt` | 否 | 图片描述，默认使用标题 |
| `draft` | 否 | `true` 暂不展示，`false` 展示；不填写时默认展示 |
| `width`、`height` | 否 | 外链图片的原始像素尺寸，帮助预留正确比例 |
| `color` | 否 | 外链照片主色，例如 `#b57956`；本地图片会自动提取 |

示例文件里的 `draft` 为 `true`，复制使用后记得改成 `false`。本地照片自动生成 WebP 预览图，缓存和构建结果不会加入 Git；外链照片直接使用你填的地址，建议图床提供适合网页尺寸的版本。

## 预览与发布

```sh
cd /Users/mungeryang/Documents/myblog
npm run dev
```

打开终端显示地址的 `/picture/` 页面。修改照片列表后刷新页面查看。

确认后按 `Ctrl+C` 结束预览，运行：

```sh
npm run check
npm run build
git add src/data/photos.json
git diff --cached --stat
git commit -m "docs: 更新照片墙"
git push origin main
```

这组命令只暂存照片列表。现有 `npm run publish` 还会自动暂存 `public/img/`，因此在图片存储分离完成前，不要用它来发布照片列表。

## 调整外观

- `src/components/PhotoGallery.astro`：标题、页面布局和相框样式。
- `src/scripts/photo-gallery.ts`：年份筛选、桌面拖动、大图切换。
- `src/pages/picture.astro`：照片页面入口。

照片墙支持 Roll / Table 切换、年份筛选、大图左右切换、Esc 关闭、手机左右滑动以及照片深链接 `#photo-01`。
