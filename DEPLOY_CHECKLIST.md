# Netlify 部署检查清单

## 🔧 已修复的问题

### ✅ 配置文件
- `netlify.toml` - 包含正确的Next.js插件配置
- `next.config.js` - 移除Vercel重定向，添加Netlify兼容性
- `package.json` - 移除@vercel/analytics依赖

### ✅ 代码修复
- 移除了`pages/_app.js`中的Vercel Analytics
- 修复了ESLint引号转义错误
- 优化了API错误处理和调试信息

## 🚀 部署步骤

### 1. 确保环境变量已设置
在Netlify控制台中设置：
- **Key**: `REPLICATE_API_TOKEN`
- **Value**: `r8_DcYijO93vhs4JgqGYSXEglq7Yq4XZLa4GTXpg`

### 2. 验证构建设置
在Netlify项目设置中确认：
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 3. 部署
- 推送代码到Git仓库
- Netlify会自动部署
- 检查部署日志确保没有错误

## 🔍 测试检查
部署完成后测试：
- [ ] 页面能正常加载
- [ ] 上传图片功能正常
- [ ] AI编辑功能能发送请求
- [ ] 查看浏览器控制台没有错误

## 🐛 常见问题
如果仍有问题，检查：
1. Netlify控制台的环境变量设置
2. 部署日志中的错误信息
3. 浏览器控制台的网络请求状态 