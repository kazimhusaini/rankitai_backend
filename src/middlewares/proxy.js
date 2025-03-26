import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const apiProxy = createProxyMiddleware('/api', {
  target: process.env.PROXY_TARGET, // Use the target server URL from environment variables
  changeOrigin: true, // Updates the host header to match the target
});

export default apiProxy;
