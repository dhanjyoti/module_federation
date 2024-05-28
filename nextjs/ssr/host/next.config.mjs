import NextFederationPlugin  from '@module-federation/nextjs-mf';
// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    client1: `client1@http://localhost:3001/_next/static/${location}/remoteEntry.js`,
    client2: `client2@http://localhost:3002/_next/static/${location}/remoteEntry.js`,
  };
};
const nextConfig = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        dts:false,
        remotes: remotes(options.isServer),

      }),
    );

    return config;
  },
};

export default nextConfig;
