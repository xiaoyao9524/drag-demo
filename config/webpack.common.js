const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 配置入口文件和plugins
const projectConfig = require('../config');
const config = projectConfig.pageConfig;

let entry = {};
let plugins = [];
for (let item of config) {
  // entry
  entry[item['entryName']] = item['entryPath'];
  // plugins
  let pluginItem = {
    alwaysWriteToDisk: true,
    filename: item['filename'],
    template: item['template'],
    inject: item['inject'] || true,
    chunks: item['chunks']
  };
  plugins.push(new HtmlWebpackPlugin(pluginItem));
}

module.exports = {
  entry,
  output: {
    filename: "static/js/[name].[hash].js",
    chunkFilename: "static/js/[name].[hash].js",
    path: path.resolve(__dirname, "../", "dist"),
    publicPath: projectConfig.publicPath || '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          priority: 10,
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: '[hash:7].[ext]',
              outputPath: 'static/img/'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: '[hash:7].[ext]',
              outputPath: 'static/video/'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[hash:7].[ext]',
              outputPath: 'static/font/'
            }
          }
        ]
      },
      {
        test: /\.art$/,
        loader: "art-template-loader"
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  }
}
