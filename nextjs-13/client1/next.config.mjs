/** @type {import('next').NextConfig} */
import NextFederationPlugin from "@module-federation/nextjs-mf";

const nextConfig = {
  webpack(config, options){
    if(!options.isServer){
      config.plugins.push(
        new NextFederationPlugin({
          name: 'client1',
          filename: 'static/chunks/remoteEntry.js',
          dts: false,
          exposes: {
            './host_app': './src/pages/index.js',
          },
          shared: {},
          extraOptions: {
            exposePages: true
          }
        }),  
      )
    }
    return config;
  }
};

export default nextConfig;
