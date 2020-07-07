const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = '8000';

module.exports = function (app) {
  const isDocker = process.env.REACT_APP_DOCKER === 'true';
  const isDev = process.env.NODE_ENV === 'development';
  console.log(isDocker, isDev);

  let target = '';
  if (isDev) {
    target = isDocker ? `http://server:${PORT}` : `http://localhost:${PORT}`;
  }
  app.use(
    createProxyMiddleware('/api', {
      target,
      changeOrigin: true,
    }),
  );
};
