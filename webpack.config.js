const path = require('path');   //node 内置的模块用来去设置路径的
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack')

//commonjs 规范
module.exports = {
    entry: './src/js/entry.js',    //入口文件的设置
    output: {                       //出口/输出的配置
        filename: 'main.js',        //输出的文件名
        publicPath:'/',             //设置为  index.html 提供资源服务的时候带有强制性
        path: path.resolve(__dirname, 'dist/js/')   //设置路径
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,      //匹配所有以 css结尾的文件
                use: [
                    'style-loader',      //将加载到的样式映射到页面上
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },{
                test : /(\.jsx|\.js)$/,
                use :{
                    loader:"babel-loader",
                    options:{
                        presets :{
                            "env" : "react"
                        }
                    }
                },
                exclude:/node_modules/
            }
        ]
    },
    devServer: {
        //host: "127.0.0.1",
        //port: 3500,
        contentBase: './dist',
        hot: true,
        proxy: {
            '/web/*': {
                target: 'http://127.0.0.1:7000/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite: {'^/web/': '' }
            },
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '去哪吃',
            template: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
