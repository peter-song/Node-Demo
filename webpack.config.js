const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const PATHS = {
  app: path.join(__dirname, 'app'),
  client: path.join(__dirname, 'client'),
  server: path.join(__dirname, 'server'),
  build: path.join(__dirname, 'server', 'public'),
};

const commonConfig = merge([
  {
    entry: {
      lib: [
        'react',
        'react-router-dom',
        'react-redux',
        'react-router',
        'react-router-config',
        'react-router-redux',
        'react-loadable',
        'moment',
        'redux',
        'qs',
        'history',
      ],
      vendor: [
        'material-ui',
      ],
      client: PATHS.client,
    },
    output: {
      path: PATHS.build,
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
    },
    node: {
      fs: 'empty',
    },
    plugins: [
      new ReactLoadablePlugin({
        filename: PATHS.build + '/react-loadable.json',
      }),
      new Dotenv({
        path: './.env',// Path to .env file (this is the default)
        safe: true,// load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
    ],
    resolve: {
      alias: {
        images: path.resolve(__dirname, 'assets/img/'),
        app: path.resolve(__dirname, 'app/'),
        theme: path.resolve(__dirname, 'app/theme'),
        utils: path.resolve(__dirname, 'app/utils/'),
        pages: path.resolve(__dirname, 'app/pages/'),
        config: path.resolve(__dirname, 'app/config'),
        actions: path.resolve(__dirname, 'app/actions/'),
        reducers: path.resolve(__dirname, 'app/reducers/'),
        components: path.resolve(__dirname, 'app/components/'),
      },
      extensions: ['.js', '.jsx'],
    },
  },
  parts.lintJavaScript({include: [PATHS.client, PATHS.app]}),
  parts.lintCSS({include: [PATHS.client, PATHS.app]}),
  parts.loadJavaScript({include: [PATHS.client, PATHS.app]}),
  parts.happyPackThread('js', ['babel-loader']),
  parts.happyPackThread('jsx', ['babel-loader']),
  parts.assets({
    path: PATHS.build,
  }),
  parts.clean(PATHS.build + '/*.js'),
  parts.clean(PATHS.build + '/*.map'),
  parts.copy(PATHS.server + '/views/assets', PATHS.build + '/assets'),
]);

const productionConfig = merge([
  {
    output: {
      path: PATHS.build,
      chunkFilename: '[name].[chunkhash:8].bundle.js',
      filename: '[name].[chunkhash:8].bundle.js',
      publicPath: '/',
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
    ],
  },
  parts.uglify(),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      safe: true,
    },
  }),
  //parts.generateSourceMaps({type: 'source-map'}),
  //parts.extractCss({
  //  use: ['css-loader', parts.autoprefix()],
  //}),
  parts.loadCSS(),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]',
    },
  }),
  parts.extractBundles([
    {
      name: ['lib', 'vendor'],
      minChunks: 2,
    },
  ]),
  parts.attachRevision(),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  ),
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({type: 'cheap-module-eval-source-map'}),
  parts.devServer({
    host: 'dev.vcg.com',//process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
  parts.extractBundles([
    {
      name: ['lib', 'vendor'],
      minChunks: 2,
    },
  ]),

]);

module.exports = env => {
  return env === 'production'
    ? merge(commonConfig, productionConfig)
    : merge(commonConfig, developmentConfig);
};