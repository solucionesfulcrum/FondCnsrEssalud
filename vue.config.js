module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      "": {
        target: 'http://10.0.52.64:8000/',
        ws: true,
      },
      "^/api": {
        target: 'http://10.56.1.127:9087/',
      }
    },
    port: 90
  }
}
