module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/APICNSR': {
        target: 'http://10.0.52.64:8000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/APICNSR': ''
        }
      },
      '/APICENTRAL': {
        target: 'http://10.56.1.127:9087/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/APICENTRAL': ''
        }
      }
    },
    port: 90
  },
}
