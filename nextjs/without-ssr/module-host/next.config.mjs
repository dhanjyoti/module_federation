import webpack from 'webpack';
import ExternalTemplateRemotesPlugin from "external-remotes-plugin";

const Mf = webpack.container.ModuleFederationPlugin

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack:(
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
      ) => {

        config.plugins.push(
            new Mf({
                name: 'host',
                remotes: {
                    client: `client@http://localhost:3001/_next/static/chunks/remoteEntry.js`,
                },
                
                // shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
              })
        )
        config.plugins.push(new ExternalTemplateRemotesPlugin())

        config.output.publicPath = "auto"
        console.log("config... ",config.output)
        // Important: return the modified config
        return config
      },
};

export default nextConfig;
