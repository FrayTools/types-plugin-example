var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

// Remaining webpack config
var webpackConfig = {
  mode: 'development',
  context: path.resolve(__dirname),
  target: 'web',
  plugins: [
    // Use the template provided by plugin-core as the plugin's landing page (or create your own)
    new HtmlWebpackPlugin({
      template: require.resolve('@fraytools/plugin-core/static/template.html')
    }),
    // Copy 
    new CopyPlugin({
      patterns: [
        // Copy manifest.json to the output folder
        { from: './static/manifest.json', to: 'manifest.json' }
      ]
    }),
    new webpack.DefinePlugin({
      'MANIFEST_JSON': JSON.stringify(require(path.resolve(__dirname, './static/manifest.json')))
    })
  ],
  // Entry point
  entry: './src/main.jsx',
  // Use Babel for JSX parsing support (Needed if not using vanilla JS)
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-react']
            ]
          }
        }
      }
    ]
  },
  // Output file
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/MyTypeDefinitionPlugin')
  },
  // Define path aliases and declare valid script file types
  resolve: {
    // Note: Allows absolute paths relative to src/ts and gives precedence over node_modules
    modules: ['node_modules'],
    extensions: ['.js'],
    alias: {
      // This ensures react comes from the example's node_modules folder and not the root
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    }
  },
  // Reduce CPU usage by ignoring node_modules
  watchOptions: {
    ignored: /node_modules/
  },
  // Clean and simple source maps
  devtool: 'source-map'
};

module.exports = webpackConfig;