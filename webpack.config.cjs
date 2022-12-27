const path = require('path');

module.exports = {
  mode: 'production',
    entry: './src/main.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.[tj]s$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.mjs'],
    },
    target: 'node',

  };

// import * as path from 'path';
// import webpack from 'webpack';

// const config: webpack.Configuration = {
//   mode: 'development',
//   entry: './src/main.ts',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//     clean: true,
//   },
//   devtool: 'inline-source-map',
//   plugins: [],
//   module: {
//     rules: [
//       {
//         test: /\.ts?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
// };

// export default config;