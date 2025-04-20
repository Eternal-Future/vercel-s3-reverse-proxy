const { createProxyMiddleware } = require('http-proxy-middleware');
const { parse } = require('url');

// 获取环境变量中的目标URL，默认为https://object-storage.example.com
const target = process.env.PROXY_TARGET || 'https://object-storage.example.com';

// 创建代理中间件
const proxy = createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' },
  onProxyReq: (proxyReq, req, res) => {
    // 可以在这里添加自定义请求头
  },
  onError: (err, req, res) => {
    res.statusCode = 500;
    res.end('Proxy Error: ' + err.message);
  }
});

module.exports = (req, res) => {
  const { pathname } = parse(req.url, true);
  
  // 如果是根路径，返回404页面
  if (pathname === '/' || pathname === '') {
    // 使用index.html作为404页面
    return res.status(404).send('Not Found');
  }
  
  // 处理代理请求
  return proxy(req, res);
};