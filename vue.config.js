// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      // add ts files
//      .rule('ts')
//      .use('ts-loader')
//        .loader('ts-loader')
//        .tap(options => {
          // modify the options...
//          return options
//        })
  }
}
