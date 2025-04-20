# S3 反向代理

这是一个用于Vercel的S3存储桶反向代理。当访问根目录时，会显示404页面，防止存储桶内容被一览无遗。

## 功能

- 反向代理到S3存储桶
- 访问根目录时返回404页面
- 可配置的目标URL

## 部署

### 一键部署到Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FEternal-Future%2Fvercel-s3-reverse-proxy&env=PROXY_TARGET&envDescription=S3存储桶的URL&envLink=https%3A%2F%2Fgithub.com%2FEternal-Future%2Fvercel-s3-reverse-proxy%23environment-variables&project-name=s3-reverse-proxy&repository-name=s3-reverse-proxy)

### 环境变量

- `PROXY_TARGET`: S3存储桶的URL，默认为 `https://object-storage.example.com`

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
vercel dev
```

（画外音：反正我只是用于minio存储来着awa）