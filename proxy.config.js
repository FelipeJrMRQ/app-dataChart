const PROXY_CONFIG = [
    {
      context: ['/api'],
      target: 'https://maps.googleapis.com',
      secure: true,
      changeOrigin: true
    }
  ];
  
  module.exports = PROXY_CONFIG;
