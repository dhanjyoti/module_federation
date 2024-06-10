import NextFederationPlugin from "@module-federation/nextjs-mf";

const remotes = (isServer)=> {
  const location = isServer ? "ssr" : "chunks";
  return {
    client: `client@http://localhost:3001/_next/static/${location}/remoteEntry.js`,
    clientServer: `client@http://localhost:3001/_next/server/remoteEntry.js`,
  }
}

const nextConfig = {
  webpack(config, options){
    config.plugins.push(
      new NextFederationPlugin({
        name: "host",
        filename: "static/chunks/remoteEntry.js",
        dts: false,
        remotes: remotes(options.isServer),
      })
    )
    return config;
  }
}
export default nextConfig;