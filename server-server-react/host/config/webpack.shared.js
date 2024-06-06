/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
            test: /\.(sa|sc|c)ss$/, // styles files
            use: ["style-loader", "css-loader", "sass-loader"],
          },
          {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        },
        {
          test: /\.(js|ts)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
  
  module.exports = webpackConfig;