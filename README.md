# munger写字的地方

Astro 静态博客，网址：https://www.mungeryang.top 。从 Hexo / Fluid 迁移，保留原有文章、照片墙、关于、简历、友链及日期链接。GitHub `main` 保存源码，GitHub Actions 构建并发布 GitHub Pages，现有 Vercel 项目也可自动构建。

## 本地预览

需要 Node.js 24（`.nvmrc` 已配置）。

```sh
npm ci
npm run dev
```

在终端显示的本地地址预览。生产检查：

```sh
npm run check
npm run build
npm run preview
```

## 写作与发布

文章仍在 `source/_posts/*.md`，原有 Markdown 不需要转换。照片、插图、PDF 放在 `public/img/`，引用地址依然是 `/img/...`。

```sh
npm run new -- "我的新文章"
```

编辑新文件，将 `draft: true` 改为 `draft: false` 后发布。新文章示例：

```yaml
---
title: 我的新文章
date: 2026-11-24 18:00:00
tags: [生活]
categories: [随笔]
draft: false
---
```

正文图片：`![照片描述](/img/life/新照片.jpg)`。日期沿用中国时间，旧文章链接由迁移清单固定。支持 Markdown、HTML、Fluid 的 `{% note success %}` 提示框和数学公式。

一条命令检查、提交文章与图片，并推送 GitHub：

```sh
npm run publish -- "docs: 更新博客"
```

也可以自行运行 `git add`、`git commit`、`git push origin main`。推送后 GitHub Actions 会自动检查、构建、发布。修改页面样式等源码时，需要手动将相关文件加入 Git 提交。

## 页面与设置

- `source/about/index.md`：关于我。
- `src/data/photos.json`：新版照片墙清单，默认空相册，只展示手动添加的照片；具体操作见 [PHOTO-GUIDE.md](PHOTO-GUIDE.md)。原 `source/picture/index.md` 保留作本地整理参考。
- `source/self/index.md`：简历，PDF 为 `public/img/jianli/miao.pdf`。
- `src/pages/links.astro`：友链。
- `src/components/Home.astro`、`src/styles/global.css`：首页及主题样式。
- `src/components/Comments.astro`：沿用 `https://comment.mungeryang.top/` Waline 评论，页面路径不变以关联原评论。
- `astro.config.mjs`：站点地址与 Markdown 配置。

提供全文搜索、归档、标签、分类、深浅色模式、RSS `/rss.xml`、站点地图 `/sitemap-index.xml`。

## 发布配置与域名

GitHub 仓库 Settings → Pages → Build and deployment → Source 应选择 **GitHub Actions**，工作流为 `.github/workflows/deploy.yml`。不要再执行旧的 `hexo deploy`，以免用生成网页覆盖源码。

`www.mungeryang.top` 迁移前通过 Vercel 解析。`vercel.json` 明确指定 Astro、构建命令 `npm run build`、输出 `dist`。保留现有 DNS 指向可以继续使用 Vercel。GitHub Pages 是另一条发布路径，不需要为此修改阿里云 DNS。若未来改为直接绑定 GitHub Pages，再在 Pages 配置中绑定域名，并将阿里云 `www` 的 CNAME 改为 `mungeryang.github.io`。

## 迁移校验与回退

`migration/legacy-manifest.json` 记录迁移前 110 篇文章的链接和 449 个原始文件的 SHA-256。每次构建检查原始文件存在、266 个旧网页路径可访问、本地图片存在，且不残留 Hexo 提示框标记。

迁移验收专用的逐字节校验：`node scripts/verify-migration.mjs --baseline`。日常编辑文章后无需再运行 baseline 校验。

迁移前完整文件夹备份位于本机相邻目录 `myblog-hexo-backup-20261124`。工作区 `legacy-hexo/` 保留旧配置、主题、生成网页，未纳入新仓库。Git 历史保留迁移前提交 `5c207900853d77e5e2dc3902fcec37e07d09af4e`，可以恢复旧站。
