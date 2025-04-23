const fetch = require('node-fetch');
const { parse } = require('url');

// 获取环境变量中的目标URL，默认为https://object-storage.example.com
const target = process.env.PROXY_TARGET || 'https://object-storage.example.com';

module.exports = async (req, res) => {
  try {
    const { pathname, search } = parse(req.url, true);
    
    // 如果是根路径，返回404页面
    if (pathname === '/' || pathname === '') {
      // 使用index.html作为404页面
      return res.status(404).send('Not Found');
    }
    
    // 构建目标URL
    const targetUrl = `${target}${pathname}${search || ''}`;
    
    // 复制原始请求头
    const headers = { ...req.headers };
    
    // 删除可能导致问题的请求头
    delete headers.host;
    delete headers.connection;
    
    // 发送代理请求
    const proxyRes = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      redirect: 'manual'
    });
    
    // 检查是否是MinIO的NoSuchKey错误
    const contentType = proxyRes.headers.get('content-type');
    if (proxyRes.status === 404 || 
        (contentType && contentType.includes('application/xml') && proxyRes.status === 200)) {
      const responseText = await proxyRes.text();
      
      // 检查是否包含NoSuchKey错误
      if (responseText.includes('<Code>NoSuchKey</Code>')) {
        // 返回自定义404页面
        return res.status(404).send('Not Found');
      }
      
      // 如果不是NoSuchKey错误，返回原始响应
      return res.status(proxyRes.status).send(responseText);
    }
    
    // 设置响应状态码
    res.status(proxyRes.status);
    
    // 复制响应头
    for (const [key, value] of proxyRes.headers.entries()) {
      res.setHeader(key, value);
    }
    
    // 返回响应内容
    const data = await proxyRes.buffer();
    return res.send(data);
  } catch (error) {
    console.error('代理错误:', error);
    return res.status(500).send(`代理错误: ${error.message}`);
  }
};