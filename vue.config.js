module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/V1': {
        target: 'http://10.0.52.64:8000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/V1': ''
        }
      },
      '/V2': {
        target: 'http://10.56.1.127:9087/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/V2': ''
        }
      }
    },
    port: 90
  },
}
