# 两人之间

适合两个人共用 iPad 的静态网页棋盘。无需后端、无第三方追踪，也不需要安装依赖。

## 第一版玩法

- 起点、18 个中间落点、终点，蛇形路线。
- 轮流掷 1–3 点骰子，每人每局一次额外前进一格。
- 普通任务、自己二选一、对方选择、留印格。首次停留自动标记，以后由标记者选择候选任务。
- 06、12 格必须停靠，双方决定解锁下一任务阶段或保持当前阶段。
- 任一人抵达终点，双方共同结束。可免费换卡、跳过、暂停和撤销上一回合。
- 内置 9 张待填写模板，不包含私人任务内容。

## 本地运行

需要 Node.js 22 或更高版本：

```sh
npm start
```

浏览器打开终端显示的本机地址。不能通过双击 index.html 完整运行，因为任务文件使用 HTTP 读取。

```sh
npm test
```

## 发布到 GitHub Pages

1. 新建独立仓库，例如 `between-us`。为使用免费 GitHub Pages，可发布只含模板的公开仓库；私人内容留在设备中。不同计划的私有仓库 Pages 能力不同。
2. 将此文件夹的全部内容（包含 `.github`、`.nojekyll`、`tests`）上传到仓库的 `main` 分支。
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 在 **Actions → Deploy to GitHub Pages → Run workflow** 启动首次发布。
5. 部署完成后，在 Pages 页面获得网站地址。后续提交到 `main` 会自动测试并更新网站。

该工作流只发布运行所需文件，不发布测试、开发服务器和 README。

## 在 iPad 添加到主屏幕

用 Safari 打开部署后的 HTTPS 网站，点分享 → 添加到主屏幕。已配置应用图标、独立显示模式和离线缓存；第一次打开需要联网。实际主屏幕安装和离线行为仍需在你的 iPad 上确认。

## 更新 HTML 任务内容

网站的默认任务库是 `tasks.html`，与游戏代码分开。每阶段至少两张卡，编号必须唯一：

```html
<article data-id="your-unique-id" data-stage="1">
  <h2>你的任务标题</h2>
  <div data-content>
    <p>你的任务内容。</p>
    <p><strong>可选的补充说明。</strong></p>
  </div>
</article>
```

`data-stage` 可为 `1`、`2`、`3`。支持 p、br、strong、em、ul、ol、li、blockquote、small；脚本、图片、外链和其他可执行内容不会显示。

有两种更新方式：

- **本机私密更新**：在游戏「任务库」编辑，或导入 HTML。内容只进入当前浏览器的本地存储；不会上传 GitHub。先导出备份，再导入替换。
- **网站默认内容更新**：替换仓库中的 `tasks.html` 并提交，自动重新部署。已有本机自定义任务优先保留；要采用新版网站内容，可以下载新版 `tasks.html` 后在任务库导入。

网站无登录和访问控制。上传到公开仓库或公开网站的任务文字可被他人读取；请勿将私人内容作为保密文件提交。浏览器清理数据可能清除进度和本机任务，请定期导出备份。Safari 和主屏幕应用的本地存储可能独立，请在实际使用的入口导入。

## 更新程序与缓存

部署新版本时，修改 `sw.js` 中的缓存版本，例如 `between-us-shell-v2`。新 Service Worker 会在旧窗口关闭后接管。网络可用时优先读取服务器文件；缓存仅供离线使用。游戏和任务保存在本地存储，不在 Service Worker 更新时清除。

## 文件

- `index.html`、`style.css`：界面和 iPad/手机响应式布局。
- `engine.js`：走棋、阶段站、留印和回合规则。
- `app.js`：任务交互、本机编辑、导入导出与存档。
- `tasks.html`：可单独替换的默认任务库。
- `manifest.webmanifest`、`sw.js`、`icons/`：主屏幕应用和离线缓存。
- `.github/workflows/pages.yml`：测试和 GitHub Pages 发布。

## 验证范围

规则单元测试通过；浏览器已验证开局、掷骰、额外一步、二选一、刷新恢复任务。尚未在真实 iPad 上验证主屏幕安装、离线启动或触摸操作。GitHub 发布需完成仓库创建和 Pages 配置。
