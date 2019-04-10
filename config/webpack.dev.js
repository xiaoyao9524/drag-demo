const webpack = require('webpack');
const merge = require("webpack-merge");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const {findPort, getIPAdress} = require('./utils');
const common = require("./webpack.common.js");
const config = require('../config');

// config
const configPort = config.devServer.port || 8080;
const publicPath = config.publicPath || '';

async function returnData() {
  let port = await findPort(configPort, configPort + 1000);
  let tipMsg = '';
  if (port !== configPort) {
    console.log(`${configPort}端口已被占用, 正在尝试切换到${port}端口。`);
    tipMsg = `${configPort}端口已被占用, 已为你开启${port}端口。`;
  }
  let retData = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    output: {
      publicPath
    },
    devServer: {
      host: '0.0.0.0',
      port,
      proxy: config.proxy || {},
      contentBase: "../src",
      // hot: true,
      quiet: true,
      overlay: {
        errors: true, // 编译出现错误时，错误直接贴到页面上
      }
    },
    plugins: [
      // 开启热更新：
      // new webpack.NamedModulesPlugin(),
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        currentEnv: JSON.stringify('test')
      }),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: tipMsg ?
              [
                `你的程序运行在：`,
                `本机地址:       localhost:${port}`,
                `或者IP地址:     ${getIPAdress()}:${port}`,
                '',
                tipMsg
              ] :
              [
                `你的程序运行在：`,
                `本机地址:       localhost:${port}`,
                `或者IP地址:     ${getIPAdress()}:${port}`
              ],
          notes: ['~^o^~']
        },
        clearConsole: true
      })
    ]
  });
  return retData;
}

module.exports = env => {
  return returnData();
};
