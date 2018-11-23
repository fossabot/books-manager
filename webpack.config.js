const webpack = require('webpack');
const path = require('path');
const entries = {};

require('glob').sync('./resources/assets/js/*.js').map(entry => {
    const name = entry.match('^.+/(.+?)\\.js$')[1];
    entries[name] = entry;
});

module.exports = {
    mode: process.env.NODE_ENV,
    entry: entries,
    output: {
        path: path.join(__dirname, '/public'),
        filename: './assets/[name].js',
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [ 'babel-loader' ],
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                use: [ 'vue-loader' ],
            },
            {
                test: /\.(js|vue)$/,
                use: [ 'eslint-loader' ],
                exclude: /node_modules/,
                enforce: 'pre',
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'postcss-loader', 'sass-loader' ],
            },
            {
                test: /\.(woff2?|ttf|eot|svg|png)(\?v=[\d.]+|\?[\s\S]+)?$/,
                use: [ 'file-loader?name=/assets/[name].[ext]' ],
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: 'vendor',
        },
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new (require('clean-webpack-plugin'))([
            path.join(__dirname, '/public/assets/*'),
        ]),
    ],
};
