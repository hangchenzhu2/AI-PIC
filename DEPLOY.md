# 🚀 Netlify 部署指南

## 📋 部署准备

### 1. 环境变量
在Netlify的项目设置中添加以下环境变量：

```
REPLICATE_API_TOKEN=你的_replicate_api_token
```

### 2. 构建设置
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node.js version**: `18`

### 3. 文件结构确认
确保以下文件存在：
- ✅ `netlify.toml` - Netlify配置文件
- ✅ `next.config.js` - Next.js配置
- ✅ `package.json` - 包含正确的构建脚本

## 🛠️ 部署步骤

### 方法1: Git部署 (推荐)
1. 将项目推送到GitHub/GitLab
2. 在Netlify中连接你的Git仓库
3. 设置环境变量 `REPLICATE_API_TOKEN`
4. 点击部署

### 方法2: 手动部署
1. 运行 `npm run build` 确保本地构建成功
2. 将整个项目文件夹拖拽到Netlify部署页面
3. 设置环境变量

## ⚙️ 配置文件说明

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### 环境变量
- `REPLICATE_API_TOKEN`: 必需，用于调用AI图像处理API

## 🔍 常见问题

### 构建失败
- 确保 Node.js 版本为 18
- 检查所有依赖是否正确安装
- 确认环境变量设置正确

### API调用失败
- 检查 REPLICATE_API_TOKEN 是否正确设置
- 确认API token有效且有足够额度

### 页面加载问题
- 检查静态资源路径
- 确认所有页面都能正常预渲染

## ✅ 部署完成后
1. 测试图片上传功能
2. 测试AI编辑功能
3. 检查所有页面链接
4. 验证响应式设计

## 🌐 域名设置
部署成功后，你可以：
- 使用Netlify提供的免费域名
- 绑定自定义域名
- 启用HTTPS (Netlify自动提供) 