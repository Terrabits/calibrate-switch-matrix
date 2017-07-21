const HtmlWebpackPlugin = require('html-webpack-plugin');
const path              = require('path');
const { spawn }         = require('child_process');
const webpack           = require('webpack');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'build');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR];

// Title
const package = require('./package.json');
const title = `${package.name} ${package.version}`

// Dependencies (use node_modules)
const dependencies = Object.keys(package.dependencies);
const externals = Object.create(null);
for (let d of dependencies) {
  externals[d] = `require('${d}')`;
}

module.exports = {
  entry: {
    'app': [
      'react-hot-loader/patch',
      SRC_DIR + '/index.js'
    ]
  },
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }],
        include: defaultInclude
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        include: defaultInclude
      },
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        include: defaultInclude
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
        include: defaultInclude
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
        include: defaultInclude
      }
    ]
  },
  target: 'electron-renderer',
  node: {
    __dirname: true,
    __filename: true
  },
  externals: externals,
  // externals: [
  //   nodeExternals()
  // ],
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: title
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: OUTPUT_DIR,
    port: 8081,
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    setup() {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError));
    }
  }
};
