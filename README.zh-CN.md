<p align="center">
  <img src="assets/motionsites-banner.svg" alt="MotionSites — a curated collection of motion-driven websites" width="100%" />
</p>

<h1 align="center">MotionSites</h1>
<p align="center"><strong>30 个独立动效网页项目，探索创意前端设计的灵感库。</strong></p>
<p align="center">收录动画落地页、交互式界面、创意作品集等网站实践，涵盖 React、GSAP、Framer Motion、Motion 与 Tailwind CSS。</p>

<p align="center">
  <a href="https://github.com/Jackxiaozhiren/MotionSites/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/Jackxiaozhiren/MotionSites?style=flat-square&logo=github" /></a>
  <img alt="30 个项目" src="https://img.shields.io/badge/30-projects-8B5CF6?style=flat-square" />
  <a href="https://jackxiaozhiren.github.io/MotionSites/"><img alt="30 个在线 Demo" src="https://img.shields.io/badge/30-live%20demos-14B8A6?style=flat-square" /></a>
  <a href="https://github.com/Jackxiaozhiren/MotionSites/actions/workflows/pages.yml"><img alt="画廊部署状态" src="https://github.com/Jackxiaozhiren/MotionSites/actions/workflows/pages.yml/badge.svg?branch=main&style=flat-square" /></a>
</p>

<p align="center"><a href="README.md">English</a> · <a href="https://jackxiaozhiren.github.io/MotionSites/">🌐 在线画廊（已上线）</a> · <a href="#项目一览">项目一览</a> · <a href="#快速开始">快速开始</a> · <a href="https://github.com/Jackxiaozhiren/MotionSites/stargazers">⭐ 给项目点 Star</a></p>

---

## 🌐 可交互作品画廊

> **源码目录已规范化：** 30 个独立项目统一放在 [`projects/`](projects/) 中，使用网页名称命名，如 [`projects/axion-studio/`](projects/axion-studio/) 和 [`projects/mindloop/`](projects/mindloop/)。原数字目录的对应关系请查阅 [旧路径 → 新路径对照表](docs/PROJECT_DIRECTORY_MIGRATION.md)。


新版本包含 [`site/`](site/) 中的**可搜索、可按技术栈筛选的在线作品目录**：用更直观的卡片浏览全部 30 个项目，并一键打开对应 GitHub 源码。

**新版展览式视觉设计：** Gallery 采用编辑式大字排版、统一的高对比度配色、放大的动效作品卡片，以及来自 **Prisma、Jack 和 Foundation 三个真实网页截图**的精选首屏展示。这些截图只有在发布清单验证后才会加载；缺失时自动使用原创排版占位，避免出现破图。已有的 30 个实时 iframe 预览、自动滚动、筛选搜索、低动效/省流量保护和源码入口均保留。无需额外下载或重新分发第三方字体、照片。

**[🌐 访问已上线的作品画廊](https://jackxiaozhiren.github.io/MotionSites/)** · [本地预览及部署方法](docs/GALLERY_DEPLOY.md)

> 发布流程会构建、截图并通过浏览器检查后再部署 **全部 30 个独立 Demo**。Jack · 3D Creator、Prisma、Axion Studio、Wanderful 和 Foundation 另有经过源码检查的精选实现说明。第三方媒体可能依赖外部服务，公开展示不代表获得素材再使用授权。

通过验证的作品都支持 **Preview here（站内预览）**：点击即可在画廊中体验真实网页，关闭后停止内嵌页面；也可以选择 **Full demo** 在新标签页打开。

### ✨ 真实网页效果预览

下列图片来自真实运行的项目页面，并非 AI 概念图。点击图片可以进入对应的在线 Demo。部分第三方素材依赖外部服务，实际效果可能受网络影响。

<table>
<tr>
<td width="33%" valign="top">
<a href="https://jackxiaozhiren.github.io/MotionSites/demos/jack-portfolio/"><img src="https://jackxiaozhiren.github.io/MotionSites/previews/jack-portfolio.jpg" alt="从真实运行网页捕获的 Jack · 3D Creator" width="100%"></a><br>
<strong>Jack · 3D Creator</strong><br>
<a href="https://jackxiaozhiren.github.io/MotionSites/demos/jack-portfolio/">在线体验 ↗</a> · <a href="https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/jack-3d-creator">源码 ↗</a>
</td>
<td width="33%" valign="top">
<a href="https://jackxiaozhiren.github.io/MotionSites/demos/prisma-landing/"><img src="https://jackxiaozhiren.github.io/MotionSites/previews/prisma-landing.jpg" alt="从真实运行网页捕获的 Prisma — Creative Studio" width="100%"></a><br>
<strong>Prisma — Creative Studio</strong><br>
<a href="https://jackxiaozhiren.github.io/MotionSites/demos/prisma-landing/">在线体验 ↗</a> · <a href="https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/prisma-creative-studio">源码 ↗</a>
</td>
<td width="33%" valign="top">
<a href="https://jackxiaozhiren.github.io/MotionSites/demos/foundation/"><img src="https://jackxiaozhiren.github.io/MotionSites/previews/foundation.jpg" alt="从真实运行网页捕获的 Foundation — New Digital Epoch" width="100%"></a><br>
<strong>Foundation — New Digital Epoch</strong><br>
<a href="https://jackxiaozhiren.github.io/MotionSites/demos/foundation/">在线体验 ↗</a> · <a href="https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/foundation-new-digital-epoch">源码 ↗</a>
</td>
</tr>
</table>



### 🧠 从视觉效果走向源码学习

画廊现在为全部作品提供[独立项目说明页](https://jackxiaozhiren.github.io/MotionSites/project.html?id=20)，包括源码目录、本地运行方法、真实 Demo 状态以及外部素材提醒。其中以下 **5 个精选案例经过对应源码检查**：

| 项目 | 可学习的实现 | 说明页 |
|---|---|---|
| Jack · 3D Creator | 分阶段入场、磁吸交互、滚动跑马灯 | [查看 →](https://jackxiaozhiren.github.io/MotionSites/project.html?id=1) |
| Prisma | 文字入场与滚动触发卡片 | [查看 →](https://jackxiaozhiren.github.io/MotionSites/project.html?id=3) |
| Axion Studio | GSAP 鼠标视差、视频帧往返播放 | [查看 →](https://jackxiaozhiren.github.io/MotionSites/project.html?id=20) |
| Wanderful | 视频分层与指针视差 | [查看 →](https://jackxiaozhiren.github.io/MotionSites/project.html?id=22) |
| Foundation | Motion 入场、悬浮导航与跑马灯 | [查看 →](https://jackxiaozhiren.github.io/MotionSites/project.html?id=28) |

添加新技术说明请参见 [PROJECT_GUIDES.md](docs/PROJECT_GUIDES.md)。项目里引用的第三方图片、视频和品牌素材**不能因为仓库公开而直接复用**；请先查看[初步素材依赖审阅](docs/ASSET_PROVENANCE_AUDIT.md)及[素材来源登记](CREDITS.md)。当前内容是前端网页概念与实验，不代表完整生产系统，也不代表所有素材具有统一开源许可。

## 为什么是 MotionSites？

MotionSites 不是单一网站或组件库，而是一个收录 **30 个独立网页实验项目** 的灵感合集。你可以浏览不同风格的落地页，阅读实际源代码，学习动效实现思路，并在本地自行尝试。

- **发现设计灵感：** 创意落地页、作品集和界面实验。
- **学习真实代码：** 直接查看各项目文件，而不是只看宣传图片。
- **探索不同动画技术：** 包含 GSAP、Framer Motion、Motion 及 CSS 动效等方案。
- **便于本地运行：** 多数项目基于 React / Vite，另有 HTML 页面。

> 说明：这里的项目各自独立，不提供统一的根目录安装入口。有些效果可能依赖外部素材或网络资源。

## 精选项目

| 项目 | 特色 | 源码 |
|---|---|---|
| **Jack · 3D Creator** | Framer Motion 创意作品集概念 | [查看 →](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/jack-3d-creator) |
| **Prisma — Creative Studio** | 创意工作室落地页 | [查看 →](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/prisma-creative-studio) |
| **Axion Studio** | GSAP 动效网页 | [查看 →](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/axion-studio) |
| **Wanderful** | GSAP 旅行风格网页 | [查看 →](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/wanderful) |
| **Foundation — New Digital Epoch** | Motion 动效体验 | [查看 →](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/foundation-new-digital-epoch) |
| **Hero Liquid Glass** | 液态玻璃风格 Hero | [查看 →](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/hero-liquid-glass) |

**动效预览：** 当前画廊已为全部 30 个项目提供在线 Demo 与从真实运行页面捕获的截图。点击 [在线画廊](https://jackxiaozhiren.github.io/MotionSites/) 中的 **Preview here** 可站内体验，也可选择 **Full demo** 在新标签页打开。若未来某个项目未通过构建或浏览器检查，画廊会保留源码入口，而不会将它标记为已上线。

## 项目一览

<details>
<summary><strong>📚 展开全部 30 个项目</strong></summary>

<br />

| # | 项目 | 技术栈 | 源码 |
|:--:|---|---|:--:|
| 01 | **Jack · 3D Creator** | React · Framer Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/jack-3d-creator) |
| 02 | **Mainframe** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/mainframe) |
| 03 | **Prisma — Creative Studio** | React · Framer Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/prisma-creative-studio) |
| 04 | **Velorah** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/velorah) |
| 05 | **Password Manager** | React · Framer Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/password-manager) |
| 06 | **Aethera** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/aethera) |
| 07 | **Venture — Space Travel** | Standalone HTML · CDN | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/venture-space-travel) |
| 08 | **VEX** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/vex) |
| 09 | **Forma** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/forma) |
| 10 | **Asme** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/asme) |
| 11 | **Orbis.Nft** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/orbis-nft) |
| 12 | **VaultShield** | React · Framer Motion · Tailwind · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/vaultshield) |
| 13 | **Asme (Motion)** | React · Framer Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/asme-motion) |
| 14 | **securify** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/securify) |
| 15 | **CINEMATIC** | React · Tailwind · Vite | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/cinematic) |
| 16 | **LinkFlow** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/linkflow) |
| 17 | **Motion Sites 18** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/motion-sites-18) |
| 18 | **RIVR** | React · Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/rivr) |
| 19 | **Nexora** | React · Framer Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/nexora) |
| 20 | **Axion Studio** | React · GSAP · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/axion-studio) |
| 21 | **Axion Studio (subproject)** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/axion-studio-subproject) |
| 22 | **Wanderful** | React · GSAP · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/wanderful) |
| 23 | **Mindloop** | React · Framer Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/mindloop) |
| 24 | **Equilibrium** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/equilibrium) |
| 25 | **Xero** | React · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/xero) |
| 26 | **Duolingo — Style Guide** | Standalone HTML | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/duolingo-style-guide) |
| 27 | **Newsletter Design** | React · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/newsletter-design) |
| 28 | **Foundation — New Digital Epoch** | React · Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/foundation-new-digital-epoch) |
| 29 | **dot.** | React · Motion · Tailwind · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/dot) |
| 30 | **Hero Liquid Glass** | React · Vite · TS | [查看 ↗](https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/hero-liquid-glass) |

</details>


### 筛选与分享作品画廊

[在线画廊](https://jackxiaozhiren.github.io/MotionSites/) 支持按动画技术栈筛选、搜索项目名称或源码目录、只显示已验证的在线 Demo。按 `/` 可以聚焦搜索框，按 `Escape` 可清空搜索内容；点击 **Share this view** 可复制保留当前筛选条件的链接。筛选逻辑完全在浏览器中执行，不使用访问者追踪。

**关于 Demo：** GitHub Actions 只有在项目成功构建并通过浏览器检查后，才会发布截图与在线预览入口；当前版本已为全部 30 个项目发布了 Demo 和真实截图。若未来某个项目验证失败，画廊仍会保留源码入口，不会虚报为在线 Demo。项目元数据统一维护在 [`site/projects.json`](site/projects.json)，不需要再同步维护另一份 JavaScript 列表。

**提交前检查：** 运行 `python3 scripts/check_gallery.py`，验证项目路径、目录数据、主要无障碍控件和双语 README 源码链接。此检查不替代真实浏览器中的视觉和性能测试。



**社交分享封面：** 新增[原创、可编辑 SVG 封面](assets/motionsites-social-card.svg)，由 GitHub Actions 导出为 1280×640 JPG 并用于在线画廊的 Open Graph 元信息。此封面不包含第三方截图或品牌 Logo。GitHub 仓库设置中的 Social preview 仍需从 CI Artifact 取得 JPG 后手动上传；参见 [GITHUB_SETUP.md](GITHUB_SETUP.md)。

### 可靠性与素材来源

精选 GSAP/Motion 网页已开始针对系统的「减少动态效果」偏好和远程视频失败进行降级处理。画廊图片加载失败时，会显示明确标注的替代封面；新的 Chromium 浏览器自动化检查会覆盖筛选、搜索、键盘操作、项目说明页和手机端横向溢出，受影响子项目另有构建测试。

**公开可访问不等于获得再分发许可。** 部分演示使用第三方视频、GIF、字体、图片（包括 `motionsites.ai` 的媒体地址）。源码引用不意味着与第三方服务存在关联，也不能证明原创或授权。请参考[素材来源审查](docs/ASSET_PROVENANCE_AUDIT.md)与[自动生成外部资源清单的工作流](.github/workflows/asset-inventory.yml)，在复用或扩大传播前核实授权。


**线上质量测量：** 新增[生产环境质量审查](docs/PRODUCTION_QUALITY.md)：针对公开 Pages 网址重复采样三次 Lighthouse，并在 390px 浏览器视口审阅全部 30 个在线 Demo。报告区分页面错误、媒体请求与版权授权问题，不将模拟分数等同于真实用户的 Core Web Vitals。

**无障碍和性能检测：** 新增 [Accessibility and Lighthouse Baseline](docs/QUALITY_AUDIT.md) 工作流：在桌面与移动端场景运行 axe-core 的 WCAG 自动检查，并输出真实 CI Lighthouse 测量分数。分数须以对应 Actions 报告为准，不是所有用户的实际体验，也不能替代人工键盘、读屏器及第三方素材授权审查。

### 作品卡片自动展示真实网页动效

滚动 Gallery 时，进入视口的作品卡片会**直接加载真正的项目网页，在卡片内自动播放动效并从顶部向下滚动**，不需要再逐个点击进去观看。桌面最多同时运行 2 个实时预览，手机最多 1 个；离开视口立即卸载，降低 CPU、流量和内存开销。加载期间保持真实截图，使用 **Auto-scroll live previews** 可以关闭自动预览并只看截图。系统设置「减少动态效果」或省流量时会自动停用。需要自己操作网页时仍可点 **Preview here** 或 **Full demo**。外部素材授权与稳定性依然需要单独核查。

## 快速开始

大部分 React / Vite 工程可以这样运行：

```bash
git clone https://github.com/Jackxiaozhiren/MotionSites.git
cd MotionSites/projects/axion-studio
npm install
npm run dev
```

按终端输出打开本地地址（通常为 `http://localhost:5173`）。切换项目时，请进入对应项目目录重新安装依赖并启动。项目 `7` 和 `26` 为 HTML 页面，可直接打开各自的 `index.html`（部分 CDN 资源需要联网）。

## 参与贡献

欢迎通过 [Issues](https://github.com/Jackxiaozhiren/MotionSites/issues/new/choose) 报告问题、反馈资源链接、推荐新创意。提交 PR 前请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。引用第三方设计、图片、字体或品牌时，请在 [CREDITS.md](CREDITS.md) 中标注来源并确认适用许可。

## 支持项目

如果其中某个网站或交互给你带来了灵感，欢迎为 [MotionSites 点一颗 ⭐ Star](https://github.com/Jackxiaozhiren/MotionSites/stargazers)，让更多开发者看到这个项目。

由 [Jackxiaozhiren](https://github.com/Jackxiaozhiren) 维护。