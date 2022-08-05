module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: 'http://10.0.52.64:8000/',
    port: 3000
  }
}
