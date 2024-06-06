Github source code - https://github.com/dhanjyoti/module_federation/tree/master

# 24/5/2024 - Module Federation in Nextjs version - 14

**Module Federation**
Module Federation is a method in which code can be split into smaller deployable modules that can be shared and consumed at runtime between applications.

**Webpack**
Webpack is a free and open-source module bundler for JavaScript. It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. Webpack takes modules with dependencies and generates static assets representing those modules.

Webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph from one or more entry points and then combines every module your project needs into one or more bundles, which are static assets to serve your content from.

***Create 3 remote/client apps with different localhost, and a root/host app that will show reomte/client apps in click of a Button in left side of the same screen using module federation in next.js***

Step 1:
Create the app
- npx create-next-app@latest

Selected 
* App name
* Page router

Step 2:
Installed Webpack
- npm i webpack

Step 3: 
Installed Module Federation
- npm i @module-federation/nextjs-mf

**Did the same for the other 3 Remote apps**

Step 4:
configuration changed for -> `next.config.mjs`
```jsx
        import NextFederationPlugin from "@module-federation/nextjs-mf";    

        const nextConfig = {
        webpack(config, options) {
            if (!options.isServer) {
            config.plugins.push(
                new NextFederationPlugin({
                name: "home",
                filename: "static/chunks/remoteEntry.js",
                remotes: {
                    weather:
                    "weather@http://localhost:3001/_next/static/chunks/remoteEntry.js",
                    simple_interest:
                    "simple_interest@http://localhost:3002/_next/static/chunks/remoteEntry.js",
                    show_input:
                    "show_input@http://localhost:3003/_next/static/chunks/remoteEntry.js",
                },
                exposes: {},
                shared: {},
                })
            );
            }

            return config;
        },
        };

        export default nextConfig;
```
`NextFederationPlugin` - This plugin is used for module federation in a Next.js application, enabling different micro-frontends to share code and dependencies.

`webpack(config, options)` - config: The current Webpack configuration object.
                             options: An object containing options for the build process, including whether the build is for the server or client.

`if (!options.isServer)` - !options.isServer condition means that the following code block will only execute for the client-side build, not the server-side.

`name: "home"` - name: The name of the current application.

`filename: "static/chunks/remoteEntry.js"` - filename: The name of the output file for the federated module (here, "static/chunks/remoteEntry.js").

`remotes:` - remotes: An object defining remote applications that this application can consume. Each key is the name of a remote, and each value is the URL to the remote's remoteEntry.js file.

`weather: "weather@http://localhost:3001/_next/static/chunks/remoteEntry.js"` - weather: Points to the remote entry file of the "weather" micro-frontend hosted at http://localhost:3001.

`exposes: {}` - exposes: An object that would define modules from this application to be exposed to other micro-frontends. It is currently empty, meaning no modules are exposed.

`shared: {}` - shared: An object that would define shared dependencies between micro-frontends. It is currently empty.


Step 5:
Create a .env file an setup as ->
NEXT_PRIVATE_LOCAL_WEBPACK = true

Create a file named .env in the root directory of our Next.js project.
`NEXT_PRIVATE_LOCAL_WEBPACK` - This is a Next.js environment variable that, when set to true, tells Next.js to use a local installation of Webpack instead of the one bundled with Next.js.

    *   When working on a Next.js project, you might need to customize your Webpack configuration beyond what Next.js natively supports.
    *   By setting NEXT_PRIVATE_LOCAL_WEBPACK=true, Next.js will use the locally installed version of Webpack, allowing you to take advantage of specific Webpack plugins or configurations not included by default.


Step 6:
Change inside package.json for script: "dev": "next dev" to ->
    "dev": "NEXT_PRIVATE_LOCAL_WEBPACK=true next dev",

```jsx
"scripts": {
"dev": "NEXT_PRIVATE_LOCAL_WEBPACK=true next dev"
}
``` 
-> The presence of NEXT_PRIVATE_LOCAL_WEBPACK=true influences the behavior of the Next.js build process, making it use the locally  installed version of Webpack instead of the bundled one.

Step 7:
Made Layout.js file inside src folder
```jsx
        import Link from "next/link";

        export default function Layout({ children }) {
        return (
            <div className="flex flex-row h-[100vw]">
            <div className="flex flex-col gap-5 w-[250px] px-10 pt-16 bg-blue-200 h-auto">
                <Link href={"/weather"} className="bg-orange-500 w-fit px-4 py-1 rounded-md">Weather</Link>
                <Link href={"/simple-interest"} className="bg-orange-500 w-fit px-4 py-1 rounded-md">Simple Interest</Link>
                <Link href={"/show-input"} className="bg-orange-500 w-fit px-4 py-1 rounded-md">Show Input</Link>
            </div>
            <div className="flex-1">{children}</div>
            </div>
        );
        }
```
-
    This Layout component creates a two-part layout:
    A vertical sidebar with links to different pages (/weather, /simple-interest, and /show-input).
    A main content area that displays the nested content (children).
    The component uses Next.js Link for navigation and flexbox for layout structure.

Step 8:
Wrap the _app.js file <Component {...pageProps}/> inside the Layout
```jsx
        import "@/styles/globals.css";
        import App from "next/app";
        import Layout from "./layout";

        function MyApp({ Component, pageProps }) {
        return (
            <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            </>
        );
        }
        MyApp.getInitialProps = async (ctx) => {
        const appProps = await App.getInitialProps(ctx);
        return appProps;
        };

        export default MyApp;
```
-     
    The MyApp component is a custom App component for a Next.js application.
    It imports global CSS styles and uses a Layout component to wrap all pages.
    It defines a static getInitialProps method to fetch initial props for the app, ensuring any necessary data fetching is done before rendering.
    The active page (Component) is rendered inside the Layout, and any props (pageProps) are passed to it.
    This structure ensures consistent layout and styling across all pages in the application.

Step 9:
Create files inside pages folder for the Remote files to show in the Root app 
```jsx
        import React from "react";

        import { lazy, Suspense, useEffect, useState } from "react";
        let RemoteTitle = () => null;
        if (process.browser) {
        //useCustomHook = require('shop/customHook').default;
        RemoteTitle = lazy(() => {
            return import("show_input/Home");
        });
        }

        export default function Page() {
        const [remoteTitle, setRemoteTitle] = useState(null);

        useEffect(() => {
            setRemoteTitle(true);
        }, []);
        return (
            <div>
            {remoteTitle ? (
                <Suspense fallback={<div>Loading...</div>}>
                <RemoteTitle />
                </Suspense>
            ) : null}
            </div>
        );
        }
```
-     
    Lazy Loading: The RemoteTitle component is lazily loaded from show_input/Home only in the browser environment, reducing the initial bundle size.
    State Management: A state variable remoteTitle is used to control when to render the lazily loaded component.
    Effect Hook: The useEffect hook sets remoteTitle to true after the component mounts, triggering the conditional rendering of the RemoteTitle component.
    Suspense: The Suspense component is used to display a loading indicator (<div>Loading...</div>) while the RemoteTitle component is being loaded.

Step 10:
Did the same for all the remote files, Except a different configuration in `next.config.mjs` for the remote apps & .env file will be added only in the Root app.
```jsx
import NextFederationPlugin from "@module-federation/nextjs-mf";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "show_input",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            home: "home@http://localhost:3000/_next/static/chunks/remoteEntry.js",
          },
          exposes: {
            // "./Test": "./src/components/test.js",
            "./Home": "./src/pages/index.js",
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
```
`remotes: {home: "home@http://localhost:3000/_next/static/chunks/remoteEntry.js"}` 

* remotes: An object defining remote applications that this application can consume.

* home: Points to the remote entry file of the "home" micro-frontend hosted at http://localhost:3000.

`exposes: {"./Home": "./src/pages/index.js"}` 
   
* exposes: An object defining which modules from this application are exposed to other micro-frontends.

* "./Home": Exposes the module located at ./src/pages/index.js under the name "Home".


# 25/5/2024 Module Federation in Nextjs using App Router

$$Pending$$


# 26/5/2024 Webpack Configuration in Javascript

* Webpack is a static module bundler. Webpack is written in Javascript.

* Webpack History - Before webpack Grunt was used.

* Uses - make build, JS & Css minify, entry file.

* Module bundler - It is a tool that takes pieces of Javascript and their dependencies and bundles them into a single file, usually for use in the browser.

* make build - make build in a single file as Required( dev build, production build etc.)

Step 1:
create two folders `src` and `dist` - `src` is where all the source folders are used & `dist` is where all our static assets are build to.

Step 2:
create an `index.html` file -
```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title><%= htmlWebpackPlugin.options.title %0></title>
        <script defer src="bundlee846cf42a6d1afa2d780.js"></script></head>
        <body>
            <div class="container">
                <img id="laughImg" alt="" />
                <h3>Dont't Laugh Challenge</h3>
                <div id="joke" class="joke"></div>
                <button id="jokeBtn" class="btn">Get Another Joke</button>
            </div>
        </body>
        </html>
```

Installed Webpack with command
- npm i -D webpack webpack-cli
            The -D is for dev dependency

Change "script": {"test"} in the package.json file to
"script": {"build": "webpack --mode production"}
            The `--mode production` is for some time, it will be removed ones we create our configuration file.

Now run `npm run build` to create a main.js file in the dist folder to check if build is running, we will get a minified code inside main.js file if its all clear.

Create the `webpack.config.js` file, and we can remove the `--mode prodution` inside package.json

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const historyApiFallback = require('connect-history-api-fallback')

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    devtool: 'source-map',
    devServer:{
        static: {
            directory: path.resolve(__dirname, 'assets')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test:/\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack App",
            filename: 'index.html',
            template: 'src/template.html',
        }),
    ],
}
```
* `const path = require('path')`: This imports the path module from Node.js, which provides utilities for working with file and directory paths.

* `const HtmlWebpackPlugin = require('html-webpack-plugin')`: This imports the html-webpack-plugin, a plugin for Webpack that simplifies the creation of HTML files to serve our bundles. It automatically injects the generated bundles into the HTML file.

* `const historyApiFallback = require('connect-history-api-fallback')`: This imports connect-history-api-fallback, a middleware for handling the history API fallback. It helps in routing for single-page applications where we want all requests to be directed to the index.html to let the client-side routing take over.

* `mode: 'development'`: Sets the mode to 'development', which optimizes the build for speed and includes more detailed source maps.

* `entry: { bundle: path.resolve(__dirname, 'src/index.js') }`: Specifies the entry point for the application. Here, `path.resolve(__dirname, 'src/index.js')` gives the absolute path to the index.js file in the src directory. The output bundle will be named bundle.

* `output: { ... }`: Defines how and where the output files should be stored.

* `path: path.resolve(__dirname, 'dist')`: Specifies the output directory as dist (relative to the current directory).

* `filename: '[name][contenthash].js'`: Sets the naming convention for the output files. [name] refers to the name specified in the entry point, and [contenthash] adds a unique hash based on the content of the file for cache busting.

* `clean: true`: Cleans the output directory before generating new files.

* `assetModuleFilename: '[name][ext]'`: Specifies the naming convention for asset modules (like images) without adding a content hash.

* `devtool: 'source-map'`: Enables source maps for debugging. 'source-map' provides the full original source, which can be useful for debugging but is slower to generate.

* `devServer: { ... }`: Configuration for the Webpack development server.

* `static: { directory: path.resolve(__dirname, 'assets') }`: Specifies a directory to serve static files from. Here, it's the assets directory.

* `port: 3000`: Sets the port for the development server to 3000.

* `open: true`: Automatically opens the application in the browser when the server starts.

* `hot: true`: Enables Hot Module Replacement, which allows modules to be updated in place without a full reload.

* `compress: true`: Enables gzip compression for the served files, which can improve load times.

* `historyApiFallback: true`: Enables the history API fallback, which helps with client-side routing for single-page applications.

* `module: { rules: [ ... ] }`: Defines how different types of modules (files) should be treated.

* `test:/\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']`: For .scss files, it uses style-loader, css-loader, and sass-loader to process and inject the styles into the DOM.

* `test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }`: For .js files (excluding node_modules), it uses babel-loader to transpile ES6+ code to ES5 using the @babel/preset-env preset.

* `test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource'`: For image files, it uses Webpack's asset modules to handle and emit them to the output directory.

* `plugins: [ new HtmlWebpackPlugin({ ... }) ]`: Specifies the plugins to use. Here, HtmlWebpackPlugin is used to generate an index.html file.

* `new HtmlWebpackPlugin({ title: "Webpack App", filename: 'index.html', template: 'src/template.html' })`:
    * Creates an index.html file in the output directory.
    * title: "Webpack App": Sets the title of the HTML document.
    * filename: 'index.html': Names the output HTML file.
    * template: 'src/template.html': Uses src/template.html as the template for the generated HTML file.

Install `npm i -D sass style-loader css-loader sass-loader` for loaders.

Install `npm i -D babel-loader @babel/core @babel/preset-env` for more browser compatibility.

Install `npm i -D webpack-bundle-analyzer` to show what the application is build from, what takes up more space etc. It gives a visual representation of our application.

 
# 27/5/2024 Module Federation in regular react without SSR


# 28/5/2024 Module Federation in next.js version - 12


# 29/5/2024 Module Fedeation in next.js-vs.13

# 30/5/2024 Module Federation in nextjs with SSR

Step 1:
npx create-next-app@latest
    To create Nextjs app

Selected 
* App name
* Page router

Step 2:
Installed Webpack
- npm i webpack

Step 3: 
Installed Module Federation
- npm i @module-federation/nextjs-mf
- npm i @module-federation/enhanced

Did the same for remote apps

```jsx
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
```
* `import NextFederationPlugin  from '@module-federation/nextjs-mf'` - This plugin is likely used to enable Module Federation in a Next.js application.

* `const remotes = isServer => {}` - This line declares a function named remotes that takes a boolean parameter isServer. This function is later used to define remote modules that will be loaded dynamically.

* `const location = isServer ? 'ssr' : 'chunks'` - This line declares a variable location which is set to 'ssr' if isServer is true, otherwise it is set to 'chunks'. This determines whether the location for loading remote modules will be for server-side rendering (ssr) or for chunks.

* `return {client2: `client2@http://localhost:3002/_next/static/${location}/remoteEntry.js`}` - This block returns an object with key client2, each pointing to the remote entry files of different clients (client2). The URLs are constructed based on the location variable and are pointing to the respective remote entry files.


```js
config.plugins.push(
    new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        dts:false,
        remotes: remotes(options.isServer),
    }),
);
``` 
* This block pushes a new instance of NextFederationPlugin into the plugins array of the webpack configuration. It configures the plugin with options including the name of the host (likely the current application), the filename for the remote entry file, whether to generate TypeScript declaration files (dts), and the remotes to load dynamically, which are determined by calling the remotes function with the isServer option.

```jsx
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
```
* `name`: The name of the remote module being exposed.
* `filename`: The filename for the remote entry file.
* `dts`: A boolean indicating whether to generate TypeScript declaration files.
* `exposes`: An object that maps exposed module paths to their corresponding source files. In this case, it exposes the ./src/pages/index.js file as ./home.
* `shared`: An object defining shared modules. It's currently empty, indicating no shared modules.
* `extraOptions`: Additional options for the plugin. In this case, it specifies exposePages as true, which likely means that Next.js pages are exposed as modules.