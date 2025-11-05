# 前端部署说明

## 后端地址配置

前端已自动根据环境选择后端地址：

- **生产环境**：自动使用 `https://pet-back-zk67.onrender.com`
- **开发环境**：使用 `http://localhost:3000`

## Vercel 部署

### 方法1：自动配置（推荐）

代码已自动配置，部署到 Vercel 后会自动使用生产环境后端地址。

### 方法2：通过环境变量配置（可选）

如果需要自定义后端地址，可以在 Vercel 中配置环境变量：

1. 进入 Vercel 项目设置
2. 找到 "Environment Variables"
3. 添加变量：
   - Key: `VITE_BACKEND_URL`
   - Value: `https://pet-back-zk67.onrender.com`

## 本地开发

本地开发时，确保后端在 `http://localhost:3000` 运行。

如果需要修改本地后端地址，可以创建 `.env.local` 文件：

```env
VITE_BACKEND_URL=http://localhost:3000
```

## 测试连接

部署后，可以通过以下方式测试：

1. 打开部署的前端地址
2. 进入 AI 问答页面
3. 发送一个问题，查看是否能正常收到 AI 回答

如果遇到 CORS 错误，检查后端是否已配置允许前端域名访问。

