'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const stage2Preset = require.resolve('babel-preset-stage-2');
const reactPreset = require.resolve('babel-preset-react');

let cssExtract = new ExtractTextPlugin('styles.css');

// preparation
let babelQuery = {
        presets: [stage2Preset],
        plugins: []
    },
    babelQueryJsx = {
        presets: [stage2Preset, reactPreset],
        plugins: []
    };

module.exports = {
    entry: {
        app: path.join(__dirname, '../app/main.js'),
        vendor: [
            'lodash',
            'jquery'
        ]
    },
    output: {
        pathinfo: true,
        publicPath: '/dist',
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        // hot: true,
        inline: true,
        port: 3010,
        publicPath: '/dist'
    },
    module: {
        rules: [
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader:'url-loader'
                }]
            },
            {
                test: /\.es6\.html$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    },
                    'template-string-loader'
                ]
            },
            {
                test: /\.css$/,
                loader: cssExtract.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader'
                    ]
                })
            },
            {
                test: /\.less$/,
                use: cssExtract.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader',
                    ]
                })
            },
            {
                test:/\.json$/,
                exclude: [/(node_modules)/],
                use: [
                    'json-loader'
                ]
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: babelQueryJsx
                }]
            },
            {
                test: /\.js$/,
                exclude: [/(node_modules)/,/(query-builder)/],
                // exclude: [/(node_modules)(?!\/trinity\/)/,/(query-builder)/,/(froala)/],
                use: [{
                    loader: 'babel-loader',
                    options: babelQuery
                }]

            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPMENT: true
        }),
        cssExtract,
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', file: 'vendor.bundle.js'})
    ],
    resolve:{
        mainFields: ['browser', 'module', 'main'],
        modules: ['node_modules']
    }
};
