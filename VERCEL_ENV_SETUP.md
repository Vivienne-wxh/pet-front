# Vercel 环境变量配置指南

## 问题
部署的前端仍然连接本地后端，需要配置生产环境后端地址。

## 解决方案：在 Vercel 配置环境变量

### 步骤

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 登录你的账号

2. **进入项目设置**
   - 找到你的项目 `pet-front`
   - 点击项目进入详情页
   - 点击顶部菜单 "Settings"

3. **添加环境变量**
   - 在左侧菜单找到 "Environment Variables"
   - 点击 "Add New"
   - 填写：
     - **Key**: `VITE_BACKEND_URL`
     - **Value**: `https://pet-back-zk67.onrender.com`
     - **Environment**: 选择 "Production"（生产环境）
   - 点击 "Save"

4. **重新部署**
   - 环境变量添加后，Vercel 会自动触发重新部署
   - 或者手动点击 "Deployments" → 选择最新的部署 → "Redeploy"

5. **验证**
   - 部署完成后，打开浏览器控制台
   - 应该能看到日志：`🔧 使用环境变量配置的后端地址: https://pet-back-zk67.onrender.com`
   - 测试 AI 问答功能，应该能正常连接后端

## 为什么需要这样配置？

- **优先级最高**：环境变量会覆盖代码中的自动判断
- **更可靠**：不依赖 hostname 判断，避免误判
- **更灵活**：可以随时修改后端地址，无需改代码

## 测试

配置完成后，打开部署的前端：
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签
3. 应该看到：`🌍 当前环境:` 或 `🔧 使用环境变量配置的后端地址:`
4. 确认后端地址是 `https://pet-back-zk67.onrender.com`

## 如果还是不行

1. 清除浏览器缓存
2. 硬刷新页面（Ctrl+Shift+R）
3. 检查 Vercel 部署日志，确认环境变量已正确设置
4. 查看浏览器控制台的网络请求，确认请求的 URL

