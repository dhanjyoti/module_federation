import webpack from 'webpack';

const Mf = webpack.container.ModuleFederationPlugin

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack:(
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
      ) => {
        config.plugins.push(
            new Mf({
                name: 'client',
                filename: './static/chunks/remoteEntry.js',
                exposes: {
                  './Page': './src/app/page',
                },
                
                // shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
              })
        )

        config.output.publicPath = "http://localhost:3001/"
        console.log("config... ",config.output)
        // Important: return the modified config
        return config
      },
};

export default nextConfig;
