import NextFederationPlugin from "@module-federation/nextjs-mf";

const nextConfig = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'client2',
        filename: 'static/chunks/remoteEntry.js',
        dts:false,
        exposes: {
          './home': './src/pages/index.js',
        },
        shared: {},
        extraOptions:{
          exposePages: true
        }
      }),
    );

    return config;
  },
};
export default nextConfig;
