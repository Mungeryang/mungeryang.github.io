# 照片墙操作指南

照片墙入口为 `/picture/`。支持“光影坐标”照片索引、黑色相框胶卷、可拖动桌面、年份筛选和大图查看。

只需编辑 `src/data/photos.json`。目前清单为空 `[]`，不会自动导入原来的 152 张照片。旧照片墙 Markdown 和本地照片仍然保留。

## 使用已有的本地 img 照片

`public` 是网站静态文件目录，网页地址中省略 `public`：

| 电脑上的文件位置（相对于博客根目录） | 照片清单里的 src |
| --- | --- |
| `public/img/life/suzhou3.jpeg` | `/img/life/suzhou3.jpeg` |
| `public/img/life/my-photo.jpg` | `/img/life/my-photo.jpg` |
| `public/img/gallery/my-photo.jpg` | `/img/gallery/my-photo.jpg` |

不要填写电脑的 `/Users/...` 路径，也不要在 `src` 里写 `public/img/...`。开头的 `/` 需要保留，文件名及后缀的大小写应与实际文件一致。

例如，使用项目里已有的 `suzhou3.jpeg`，把 `photos.json` 的 `[]` 替换为：

```json
[
  {
    "src": "/img/life/suzhou3.jpeg",
    "title": "旅途中的风景",
    "date": "2026-11-24",
    "alt": "旅行途中拍下的风景",
    "story": "这里填写这张照片的故事。",
    "draft": false
  }
]
```

标题、日期和故事按实际情况填写。本地照片会自动读取尺寸、提取主色，并生成 WebP 预览图；点开大图时加载原图，不会修改原文件。

## 添加一张新的本地照片

1. 把需要展示的照片放入 `public/img/gallery/`，例如 `public/img/gallery/my-photo.jpg`。也可以继续放入现有的 `public/img/life/`。
2. 在 `photos.json` 数组中添加一个条目，把 `src` 填为 `/img/gallery/my-photo.jpg`。
3. 多张照片的条目之间加英文逗号，最后一个条目后不加逗号。

```json
[
  {
    "src": "/img/life/suzhou3.jpeg",
    "title": "第一张照片",
    "date": "2026-11-24",
    "story": "第一张照片的故事。"
  },
  {
    "src": "/img/gallery/my-photo.jpg",
    "title": "第二张照片",
    "date": "2026-11-25",
    "story": "第二张照片的故事。"
  }
]
```

清单的先后顺序就是展示顺序，年份筛选根据 `date` 自动生成。只展示清单里明确列出且不是草稿的照片。

## 本地预览

```sh
cd /Users/mungeryang/Documents/myblog
npm run dev
```

打开终端显示网址的 `/picture/` 页面。修改清单后刷新页面查看。`draft: true` 表示暂不展示；改为 `false` 或省略该字段即可展示。

## 发布到线上

网站不能直接读取你电脑上的新文件。已有仓库里的照片可以直接引用；新照片若使用 `/img/...` 路径，需要把选中的这一张照片与清单一起提交，远程构建才能取得它。

确认预览后按 `Ctrl+C`，运行：

```sh
npm run check
npm run build
git add src/data/photos.json
# 只有新增了本地照片，才添加这一张具体文件；已有仓库照片可跳过下面一行。
git add public/img/gallery/my-photo.jpg
git diff --cached --stat
git commit -m "docs: 更新照片墙"
git push origin main
```

第二条 `git add` 会把指定的那张照片上传到 GitHub，不会自动添加整个图片文件夹。如果你不希望这张照片进入 GitHub，就先上传到自己的图床或 OSS，再在 `src` 中填可公开访问的 HTTPS 链接，例如 `https://img.example.com/my-photo.jpg`。这时只提交清单即可。本项目尚未配置照片独立上传服务。

也可以使用已经支持照片清单的快捷发布命令：

```sh
npm run publish -- "add picture"
```

它会依次显示检查、构建、准备文件、提交和推送的进度，提交照片清单及清单中实际使用的本地图片，并处理本次修改文章引用的图片；不会扫描并添加整个 `public/img/` 目录。`draft: true` 的照片不会被自动添加。推送连接设置了超时，遇到网络问题会明确报错，之后可重试同一条命令。

## 可用字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `src` | 是 | `/img/` 开头的本地图片路径，或 HTTPS 图片地址 |
| `title` | 是 | 相框和光影坐标中的标题 |
| `date` | 否 | `YYYY-MM-DD`，用于年份筛选、坐标日期和大图标题 |
| `story` | 否 | 点开大图展示的文字，支持 Markdown |
| `alt` | 否 | 图片描述，默认使用标题 |
| `draft` | 否 | `true` 暂不展示，`false` 展示；省略时默认展示 |
| `width`、`height` | 否 | 外链图片原始像素尺寸；本地图片自动读取 |
| `color` | 否 | 外链照片主色，如 `#b57956`；本地图片自动提取 |

完整示例在 `src/data/photos.example.json`，该文件不会自动展示。示例中的 `draft` 为 `true`，复制使用后记得改成 `false`。

## 调整外观

- `src/components/PhotoGallery.astro`：页面文案、光影坐标、相框和样式。
- `src/scripts/photo-gallery.ts`：筛选、桌面拖动、大图切换。
- `src/pages/picture.astro`：照片页面入口。

大图支持左右方向键、Esc 关闭、手机左右滑动以及 `#photo-01` 形式的照片链接。
