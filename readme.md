# 阿晚科技 - 企业官网模板

一个完整的、可直接运行的电商技术服务企业官网静态HTML模板，简约高级、年轻化商务风，浅蓝+白色主配色。

---

## 目录结构

```
company_website_template/
├── index.html                    # 网站首页入口
├── config.html                   # 站点配置说明页
├── pages/                        # 子页面目录
│   ├── about.html                # 关于我们
│   ├── products.html             # 产品列表
│   ├── product-detail.html       # 产品详情
│   ├── cases.html                # 案例列表
│   ├── case-detail.html          # 案例详情
│   ├── news.html                 # 新闻列表
│   ├── news-detail.html          # 新闻详情
│   ├── contact.html              # 联系我们
│   └── qualifications.html       # 资质荣誉
├── server/                       # Node.js 邮件服务（新增）
│   ├── package.json              # npm 依赖配置
│   ├── config.js                 # SMTP 邮箱配置
│   └── email-server.js           # Express + Nodemailer 邮件发送服务
├── css/                          # 样式文件目录
│   ├── global.css                # 全局样式（含主题变量）
│   ├── nav.css                   # 导航栏样式
│   ├── home.css                  # 首页样式
│   ├── product.css               # 产品页样式
│   ├── case.css                  # 案例页样式
│   ├── news.css                  # 新闻页样式
│   ├── about.css                 # 关于我们页样式
│   ├── animations.css            # 动画样式
│   └── responsive.css            # 响应式适配
├── js/                           # JavaScript目录
│   ├── main.js                   # 主逻辑（轮播/导航/主题/弹窗等）
│   ├── slider.js                 # 轮播组件
│   ├── form-validate.js          # 表单验证 + 双通道邮件提交
│   ├── product-filter.js         # 产品/案例筛选
│   └── agnes-ai.js               # Agnes AI 智能聊天助手（新增）
├── images/                       # 图片资源目录
└── fonts/                        # 字体文件目录
```

---

## 快速开始

### 本地预览

1. 在D盘新建文件夹 `D:\company_website_template`
2. 将所有文件按上述目录结构存放
3. 双击 `index.html` 即可在浏览器中预览
4. 无需本地服务器，纯静态文件即可运行

### 推荐浏览器

- Google Chrome（推荐）
- Microsoft Edge
- Firefox
- Safari

---

## 功能清单

- [x] 顶部通知滚动公告栏
- [x] 多级下拉导航菜单（支持三级）
- [x] Hero全屏轮播Banner（3张，自动播放/手动切换）
- [x] 企业实力数据板块（数字增长动画）
- [x] 关于我们简介
- [x] 产品分类展示（含Tab筛选）
- [x] 案例工程展示
- [x] 新闻资讯（图文混排卡片）
- [x] 资质荣誉缩略展示
- [x] 联系我们CTA
- [x] 多栏页脚导航
- [x] 侧边快捷导航
- [x] 悬浮在线咨询按钮
- [x] 在线客服弹窗（微信/电话/表单）
- [x] 搜索弹窗
- [x] 深色/浅色主题切换
- [x] 滚动渐入动画
- [x] 返回顶部按钮
- [x] 页面加载动画
- [x] 全响应式适配（PC/平板/手机）

---

## Agnes AI 助手（新增）

全站集成了 **Agnes AI 智能聊天助手**，右下角浮动图标 `🤖` 点击即可打开对话窗口。

### 功能说明
- 自动回复访客关于产品、服务的常见问题
- 支持配置真实的 AI 后端 API 实现智能对话
- 未配置 API 时以演示模式运行（随机回复预设文案）
- 夜间模式自动适配主题色

### 配置真实 AI 后端

打开任意页面的底部，找到 `AGNES_CONFIG` 配置块：

```html
<script>
window.AGNES_CONFIG = {
  apiUrl: 'https://your-api-endpoint.com/chat'  // 替换为实际 API 地址
};
</script>
```

API 要求：POST 请求，接收 `{ message: "用户消息", history: 消息数 }`，返回 `{ reply: "回复内容" }`。

### 自定义欢迎语
修改 `js/agnes-ai.js` 文件开头的 `welcomeMsg` 变量。

### 在所有页面添加/移除
- 已预置在所有 HTML 文件底部（`</body>` 前）
- 如需移除，全局搜索 `agnes-ai.js` 相关行删除即可

## 修改指南

### 修改公司名称

全局搜索替换 `阿晚科技` 为你的公司名称。

### 修改联系方式

- 电话：搜索 `6666-6666-6666` 替换
- 邮箱：搜索 `158964224@qq.com` 替换
- 地址：搜索 `安徽省人民政府` 替换

### 修改主题颜色

打开 `css/global.css`，修改 `:root` 中的CSS变量：

```css
:root {
  --primary: #4a9ede;          /* 主色 - 修改此项即可改变全站主色调 */
  --accent: #f0a500;           /* 点缀色 */
  /* ... */
}
```

### 修改ICP备案号

搜索 `皖ICP备XXXXXXXX号-1` 替换为你的备案号。

### 替换图片

所有图片目前使用 `https://images.unsplash.com/` 在线图片。

**替换步骤：**
1. 将实际图片放入 `images/` 目录
2. 在HTML文件中将 `src="https://images.unsplash.com/..."` 替换为 `src="../images/your-image.jpg"`

**主要需要替换图片的文件：**
| 文件 | 说明 |
|------|------|
| index.html | Hero轮播图(3张)、关于我们图、产品图(6张)、案例图(3张)、新闻图(3张) |
| pages/about.html | 团队头像、企业文化图标 |
| pages/products.html | 产品图片 |
| pages/product-detail.html | 产品详情图片 |
| pages/cases.html | 案例图片 |
| pages/case-detail.html | 案例大图和画廊 |
| pages/news.html | 新闻封面图 |
| pages/news-detail.html | 新闻封面图 |

### 修改公告内容

在HTML文件中搜索 `scroll-txt`，修改 `<span>` 内的文本。

### 修改导航菜单

在每个HTML文件的 `<ul class="nmenu">` 中增删 `<li>` 项。

---

## 部署说明

### 静态托管部署

本项目为纯静态HTML网站，可部署到任何静态托管服务：

- **GitHub Pages**: 推送代码到GitHub仓库，启用Pages功能
- **Vercel**: 连接GitHub仓库，自动部署
- **Netlify**: 拖拽文件夹即可部署
- **阿里云OSS**: 上传文件到OSS Bucket，开启静态页面访问
- **腾讯云COS**: 同上

### Nginx部署

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/company_website;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## 表单对接说明（重要）

表单提交采用 **双通道机制**：优先使用本地邮件服务（Node.js），失败时自动切换到 FormSubmit.co 备用通道。

### 方案A：本地邮件服务（主通道，推荐）

基于 Node.js + Nodemailer 的自有后端，可配置任意 SMTP 邮箱，不受第三方限制。

**首次使用步骤：**
1. 进入 `server/` 目录，安装依赖：
   ```
   cd server
   npm install
   ```
2. 打开 `server/config.js`，配置你的邮箱信息：
   - `smtp.user`：你的QQ邮箱地址
   - `smtp.pass`：你的QQ邮箱授权码（需要在QQ邮箱设置中生成）
   - `notifyEmail`：接收留言通知的邮箱
   
   > **获取QQ邮箱授权码：** 登录QQ邮箱 → 设置 → 账户 → POP3/SMTP服务 → 开启 → 生成授权码

3. 启动服务器：
   ```
   cd server
   npm start
   ```
   服务运行在 `http://localhost:3001`

4. 打开网站测试留言提交，正常时应收到邮件通知。

**修改接收邮箱：**
打开 `server/config.js`，修改 `notifyEmail` 字段。

### 方案B：FormSubmit.co（备用通道）

当本地邮件服务不可用时（如未启动），自动切换到 FormSubmit.co 免费服务。

**首次使用步骤：**
1. 打开浏览器访问 `https://formsubmit.co/`
2. 用你的邮箱 `158964224@qq.com` 注册
3. 去邮箱查收确认邮件，点击激活
4. 激活后，即使本地服务未运行，留言也能通过 FormSubmit 送达

**修改接收邮箱：**
打开 `js/form-validate.js`，搜索 `158964224@qq.com` 替换为你的邮箱。

### 故障排查

| 现象 | 原因 | 解决 |
|------|------|------|
| 表单提交成功但未收到邮件 | 两种通道均不可用 | 确保本地服务运行 或 FormSubmit已激活 |
| 控制台显示“服务器响应异常” | 本地服务未启动 | 运行 `cd server && npm start` |
| FormSubmit 显示提示“确认邮箱” | 邮箱未激活 | 去邮箱点击 FormSubmit 确认链接 |

---

## 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome | 90+ |
| Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| IE | 不支持（建议使用现代浏览器） |

---

## 技术栈

- **HTML5** - 语义化标签
- **CSS3** - CSS变量、Grid、Flexbox、动画
- **JavaScript** - ES6+（原生，无框架依赖）
- **响应式设计** - 三档断点适配

---

## 版权说明

本模板仅供学习和企业官网搭建使用，可自由修改和商用。

---

## 更新日志

- **v2.0** (2026-06) - 品牌升级：阿晚科技，电商技术服务领域，表单对接FormSubmit
- **v1.0** (2025-12) - 初始版本
