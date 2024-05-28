import NextFederationPlugin from "@module-federation/nextjs-mf";

const nextConfig = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'client1',
        filename: 'static/chunks/remoteEntry.js',
        dts:false,
        exposes: {
          './index': './src/pages/index.js',
          './newpage': './src/pages/newpage.js',
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
