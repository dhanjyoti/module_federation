const NextFederationPlugin  = require('@module-federation/nextjs-mf');
// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'client1',
        filename: 'static/chunks/remoteEntry.js',
        dts:false,
        exposes: {
          './home': './pages/index.js',
        },
        shared: {},
        extraOptions:{
          exposePages: true
        }
      }),
    );

    return config;
  },
}

module.exports = nextConfig

