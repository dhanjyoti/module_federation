import NextFederationPlugin from "@module-federation/nextjs-mf";

const nextConfig = {
  webpack(config, options){
    const {isServer} = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: "client",
        ...(isServer ? {remoteType: "script"} : {}),
        filename: "static/chunks/remoteEntry.js",
        dts: false,
        exposes: {
          "./index": "./src/pages/index.js",
          "./test": "./src/scripts/test.js",
        },
        shared: {},
        extraOptions: {
          exposePages: true,
        }
      })
    );
    return config;
  }
}
export default nextConfig;