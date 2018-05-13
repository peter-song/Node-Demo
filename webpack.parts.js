const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const BabelWebpackPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const cssnano = require('cssnano');
const HappyPack = require('happypack');
const os = require('os');
const cpuCount = os.cpus().length;
const happyThreadPool = HappyPack.ThreadPool({size: cpuCount});
const CopyWebpackPlugin = require('copy-webpack-plugin');

exports.devServer = ({host, port} = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warning: true,
    },
  },
});

// exports.indexTemplate = (options) => ({
//   plugins: [
//     new HtmlWebpackPlugin({
//       inject: false,
//       template: require('html-webpack-template'),
//       title: options.title,
//       appMountId: options.appMountId,
//       baseHref: '/',
//     }),
//   ],
// });

exports.lintJavaScript = ({include, exclude, options}) => ({
  module: {
    rules: [{
      test: /\.jsx?$/,
      include,
      exclude,
      enforce: 'pre',
      loader: 'eslint-loader',
      options,
    }],
  },
});

exports.loadCSS = ({include, exclude} = {}) => ({
  module: {
    rules: [{
      test: /\.css$/,
      include,
      exclude,
      use: ['style-loader', 'css-loader'],
    }],
  },
});

exports.extractCss = ({include, exclude, use}) => {

  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css',
  });

  return {
    module: {
      rules: [{
        test: /\.css$/,
        include,
        exclude,
        use: plugin.extract({
          use,
          fallback: 'style-loader',
        }),
      }],
    },
    plugins: [plugin],
  };
};

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')(),
    ]),
  },
});

exports.lintCSS = ({include, exclude}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'postcss-loader',
        options: {
          plugins: () => ([
            require('stylelint')(),
          ]),
        },
      },
    ],
  },
});

exports.loadImages = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options,
        },
      },
    ],
  },
});

exports.loadJavaScript = ({include, exclude}) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include,
        exclude,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
});

exports.generateSourceMaps = ({type}) => ({
  devtool: type,
});

exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundle) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

exports.clean = (path) => ({
  plugins: [
    new CleanWebpackPlugin([path || '']),
  ],
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.minifyJavaScript = () => ({
  plugins: [
    new BabelWebpackPlugin(),
  ],
});

exports.minifyCSS = ({options}) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};
/**
 * id string required
 * loaders Array required
 */
exports.happyPackThread = (id, loaders) => {
  return {
    plugins: [
      new HappyPack({
        id,
        threadPool: happyThreadPool,
        loaders,
      }),
    ],
  };
};

exports.assets = ({filename, path, fullPath = false}) => ({
  plugins: [
    new AssetsPlugin({
      filename,
      path,
      fullPath,
      prettyPrint: true,
    }),
  ],
});

exports.copy = (from, to) => {
  return {
    plugins: [
      new CopyWebpackPlugin([{
        from,
        to,
      }]),
    ],
  };
};

exports.uglify = () => {
  return {
    plugins: [
      new ParallelUglifyPlugin({
        workerCount: cpuCount,
        cacheDir: 'dist/.cache/',
        uglifyJS: {
          output: {
            comments: false,
          },
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true,
          },
          mangle: true,
        },
      }),
    ],
  };
};