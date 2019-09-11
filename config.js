/*
  * pageConfig: 配置入口文件和html-webpack-plugin
  *        每一项     类型      描述
  * @param entryName String   该模块（页面）入口文件名称
  * @param entryPath String   该模块（页面）入口文件的路径
  * @param filename  String   打包后的html文件名
  * @param template  String   该文件的html模板
  * @param chunks    Array    一般第一个为该文件的enterName，如果用到第三方库（比如jquery）则第二个为'common'
* */

module.exports = {
  publicPath: '/',
  devServer: {
    port: 8080
  },
  pageConfig: [
    {
      entryName: "index",
      entryPath: "./src/index.main.js",
      filename: "index.html",
      template: "./src/index.html",
      chunks: ['index', 'common']
    },
    // 列表的拖拽排序
    {
      entryName: "listSort",
      entryPath: "./src/listSort.main.js",
      filename: "listSort.html",
      template: "./src/listSort.html",
      chunks: ['listSort', 'common']
    },
    // 拖拽删除demo
    {
      entryName: "dragRemove",
      entryPath: "./src/dragRemove.main.js",
      filename: "dragRemove.html",
      template: "./src/dragRemove.html",
      chunks: ['dragRemove', 'common']
    },
    {
      entryName: "test",
      entryPath: "./src/test.main.js",
      filename: "test.html",
      template: "./src/test.html",
      chunks: ['test', 'common']
    }
  ],
  proxy: {
    '/index': {
      target: 'https://www.bilibili.com',
      changeOrigin: true
    }
  }
};
