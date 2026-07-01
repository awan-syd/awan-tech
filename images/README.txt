# 图片资源说明

本目录用于存放网站实际使用的图片资源。

## 图片命名规范

| 用途 | 命名格式 | 示例 |
|------|----------|------|
| Logo | logo.png / logo-dark.png | `logo.png` |
| Hero轮播 | hero-01.jpg, hero-02.jpg, hero-03.jpg | `hero-01.jpg` |
| 产品图片 | product-{名称}.jpg | `product-website.jpg` |
| 案例图片 | case-{名称}.jpg | `case-huadi.jpg` |
| 新闻图片 | news-{日期}-{标题}.jpg | `news-20251215-award.jpg` |
| 团队头像 | team-{姓名}.jpg | `team-zhangwei.jpg` |
| 合作伙伴 | partner-{名称}.png | `partner-huadi.png` |
| 资质证书 | cert-{名称}.jpg | `cert-iso9001.jpg` |
| 关于我们 | about-{类型}.jpg | `about-office.jpg` |

## 图片尺寸建议

| 位置 | 推荐尺寸 | 格式 |
|------|----------|------|
| Hero轮播图 | 1920x700px | JPG (质量80%) |
| 产品卡片图 | 400x250px | JPG |
| 案例卡片图 | 500x350px | JPG |
| 新闻卡片图 | 300x200px | JPG |
| 团队头像 | 120x120px | JPG/PNG |
| 合作伙伴LOGO | 140x40px | PNG (透明背景) |
| 资质证书 | 300x400px | JPG/PNG |
| 关于我们配图 | 600x400px | JPG |
| 新闻封面图 | 860x400px | JPG |

## 当前状态

目前所有图片使用在线占位图 (placehold.co)，替换步骤：

1. 将实际图片放入本目录，按上述命名规范命名
2. 在各HTML文件中搜索 `https://placehold.co/`
3. 将占位图链接替换为相对路径，如 `images/hero-01.jpg`

## 优化建议

- 使用TinyPNG等工具压缩图片，减少加载时间
- 大图片使用WebP格式（需添加JPG降级）
- 考虑使用CDN加速图片加载
