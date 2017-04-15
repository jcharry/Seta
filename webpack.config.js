const webpack = require('webpack');
const path = require('path');
// const rules = require('./config/rules');
// const plugins = require('./config/plugins');
// const envFile = require('node-env-file');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const precss = require('precss');
const autoprefixer = require('autoprefixer');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PWD = process.cwd();

module.exports = {
    devtool: process.env.NODE_ENV === 'production' ? '' : 'source-map',
    context: path.resolve(__dirname, './app'),
    entry: [
        // 'webpack-dev-server/client?http://localhost:8080',
        // 'webpack/hot/dev-server',
        './app.jsx'
    ],
    node: {
        fs: 'empty'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, './app')
        ],
        alias: {
            components: path.resolve(__dirname, 'app', 'components'),
            actions: path.resolve(__dirname, 'app', 'actions', 'actions.js'),
            app: path.resolve(__dirname, 'app'),
            images: path.resolve(__dirname, 'app', 'images'),
            utils: path.resolve(__dirname, 'app', 'utils'),
            models: path.resolve(__dirname, 'app', 'models')
        },
        extensions: ['.js', '.jsx', '.css', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // {
            //     test: /\.js?$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: 'eslint-loader'
            // },
            // {
            //     test: /\.jsx?$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: 'eslint-loader'
            // },
            {
                test: /\.scss/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.css/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {

                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.(mp4|mov)$/,
                loader: 'url-loader?limit=10000&mimetype=video/mp4'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer]
            }
        })
    ],
    devServer: process.env.NODE_ENV === 'production' ? {} : {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true
        // proxy: [ {
        //     path: '/api/*',
        //     target: 'http://localhost:3000'
        // }]
    }
};
