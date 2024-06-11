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

$$Abondoned$$


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
Step 1:
`npx create-react-app client1` - To create the react app.

Step 2:
`npm i -D @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader html-webpack-plugin sass sass-loader style-loader url-loader webpack webpack-cli webpack-dev-server` - When setting up a project using Module Federation with Webpack, the packages we have listed serve various essential purposes to ensure smooth development, bundling and deployment processes.
    1. `@babel/core`: Core Babel library for transforming modern Javascript into backward-compatible versions for older browsers.
    2. `@babel/preset-env`: A smart preset that allows us to use the latest Javascript without needing to micromanage syntax transforms.
    3. `@babel/preset-react`: Preset for transforming React JSX syntax into Javascript.
    4. `babel-loader`: Integrates Babel with Webpack to transpile Javascript files.
    5. `css-loader`: Resolves CSS imports and allows bundling CSS files to serve our bundles.
    6. `html-webpack-plugin`: Simplifies creation of HTML files to serve our bundles.
    7. `sass`: A CSS preprocessor that adds special features such as variables, nested rules, and mixins.
    8. `sass-loader`: Loads and compiles SCSS files into CSS.
    9. `style-loader`: Injects CSS into the DOM.
    10. `url-loader`: Transforms files into base64 URIs, which can be useful for handling images and fonts.
    11. `webpack`: The core library for Webpack, a module bundler.
    12. `webpack-cli`: Command-line interface for running Webpack commands.
    13. `webpack-dev-server`: A development server that provides live reloading and a friendly development environment.

Step 3: 
Create `webpack.config.js` file and provide the necessary configurations. This configuration will be different inside the host application.
```js
        const path = require("path");
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        const { ModuleFederationPlugin } = require('webpack').container;
        const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');

        module.exports = {
        output: {
            path: path.join(__dirname, "/dist"), // the bundle output path
            filename: "bundle.js", // the name of the bundle
        },
        plugins: [
            new HtmlWebpackPlugin({
            template: "src/index.html", // to import index.html file inside index.js
            }),
            new ModuleFederationPlugin({
            name: 'client',
            filename: 'remoteEntry.js',
            exposes: {
                './app': './src/App.js',
            }
            }),
            new ExternalTemplateRemotesPlugin(),
        ],
        devServer: {
            port: 3001, // you can change the port
        },
        module: {
            rules: [
            {
                test: /\.(js|jsx)$/, // .js and .jsx files
                exclude: /node_modules/, // excluding the node_modules folder
                use: {
                loader: "babel-loader",
                },
            },
            {
                test: /\.(sa|sc|c)ss$/, // styles files
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
            ],
        },
        };
```
It includes configurations to bundle Javascript, manage HTML, and handle styles and assets. 
    1. Basic Configuration:
```js
        const path = require("path");
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        const { ModuleFederationPlugin } = require('webpack').container;
        const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');
```
These are the necessary imports for setting up path resolution, HTML template handling, module federation, and external template remotes.

    2. Output Configuration:
```js
        output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.js",
        },
```
This specifies where the bundled files will be output(in the `dist` directory) and the name of the main bundle file(`bundle.js`).

    3. Plugins:
```js
        plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
        new ModuleFederationPlugin({
            name: 'client',
            filename: 'remoteEntry.js',
            exposes: {
            './app': './src/App.js',
            }
        }),
        new ExternalTemplateRemotesPlugin(),
        ],
```
`HtmlWebpackPlugin`: This plugin simplifies the creation of an HTML file to include the Webpack bundles. It uses `src/index.html` as a template.
`ModuleFederationPlugin`:
    * `name`: Identifies this container as `client`.
    * `filename`: Specifies the name of the file that will act as the entry point for remote modules(`remoteEntry.js`).
    * `exposes`: Declares the modules that this container exposes to other containers. Here, it exposes `./src/App.js` as `./app`.
`ExternalTemplateRemotesPlugin`: This plugin facilitates loading remote modules defined in external templates, which is useful in Module Federation setups where remote modules are dynamically loaded.

    4. Dev Server Configuration: 
```js
        devServer: {
        port: 3001,
        },
```
Configures the development server to run on port 3001. This server provides live reloading and a development environment for testing the application.

    5. Module Rules:
```js
        module: {
            rules: [
                {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
                },
                {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader",
                options: { limit: false },
                },
            ],
        },
```
* Javascript/JSX files: Uses `babel-loader` to transpile `.js` and `.jsx` files, excluding `node_modules`.
* Styles: Uses `style-loader`, `css-loader`, and `sass-loader` to handle and bundle styles(`.css`, `.scss`, `.sass`).
* Assets: Uses `url-loader` to handle images and fonts, allowing them to be included in the bundle. 

Step 4:
Create a `.babelrc` file in the root of the application. It will be same inside the host application.
```js
        {
            "presets": [
                "@babel/preset-env",
            ["@babel/preset-react", {"runtime": "automatic"}]
            ]
        }
```
* `@babel/preset-env`: 
    1. This preset automatically determines the Babel plugins and pollyfills we need based onn our target environments(which can be specified in a `browserslist` configuration).
    2. It helps us write modern Javascript(ES6+) and have it transpiled down to ES5 or other versions as required by our target browsers.

* `@babel/preset-react` with `{"runtime": "automatic"}`:
    1. `@babel/preset-react`: Enables Babel to transform JSX syntax into Javascript.
    2. `{"runtime": "automatic"}`: This configuration utilizes the new JSX transform introduced in React 17, which allows us to use JSX without having to import React at the top of our files. This makes our code cleaner and less error-prone.

**How this fits into Module Federation and Webpack**
* Unified Code Transformation: Ensuring that all federated modules are transpiled using the same Babel presets helps maintain a consistent codebase. This is critical when modules from different sources or teams are combined in a single application.

* Modern Javascript and React: By using `@babel/preset-env` and `@babel/preset-react`, we can write modern Javascript and REact code, which is then transpiled to be compatible with older browsers and environments. This compatibility is essential in a federated setup where different parts of the application might be deployed in various environments.

* Simplified Development: The automatic runtime for React's JSX transform reduces boilerplate code and the chance of errors, simplifying the development process. This is particularly beneficial in a large, modular system where maintaining consistent imports across many files can be cumbersome.

Step 5:
Make necessary changes inside the App.js file of the client application, whatever we want to show in the host application.

Step 6:
Create another `index.html` file inside the src folder. 
```js
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React with webpack without SSR</title>
        </head>
        <body>
            <div id="root"></div>

            <script src="bundle.js"></script>
        </body>
        </html>
```
It will serve as the entry point for our React application when bundled and run by Webpack.
Here are 3 points -
    1. Serve as the template for generating the final HTML file using `HtmlWebpackPlugin`.
    2. Privide a `div` with the ID `root`, which acts as the mount point for our React application.
    3. Include the Webpack-generated Javascript bundle (`bundle.js`) to ensure our React code runs in the browser.

Step 7: 
Change the script inside the package.json file of all the applications to
```js
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
```

Step 8:
install `npm i react-router-dom` in the host application. 

Step 9:
Create a `webpack.config.js` file inside the root of the host application with the following configuration -
```js
        const path = require("path");
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        const { ModuleFederationPlugin } = require('webpack').container;
        const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');

        module.exports = {
        output: {
            path: path.join(__dirname, "/dist"), // the bundle output path
            filename: "bundle.js", // the name of the bundle
            publicPath: 'auto',
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
            template: "src/index.html", // to import index.html file inside index.js
            }),
            new ModuleFederationPlugin({
                name: 'host',
                remotes: {
                client: 'client@http://localhost:3001/remoteEntry.js',
                client2: 'client2@http://localhost:3002/remoteEntry.js',
                },
            }),
            new ExternalTemplateRemotesPlugin(),
        ],
        devServer: {
            port: 3000, // you can change the port
            historyApiFallback: true,
            static: {
            directory: path.resolve(__dirname, 'dist'),
            },
        },
        module: {
            rules: [
            {
                test: /\.(js|jsx)$/, // .js and .jsx files
                exclude: /node_modules/, // excluding the node_modules folder
                use: {
                loader: "babel-loader",
                },
            },
            {
                test: /\.(sa|sc|c)ss$/, // styles files
                use: ["style-loader", "css-loader", "sass-loader", 'postcss-loader'],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
            ],
        },
        };
```
Here,
* `publicPath`: Set to `auto` to automatically determine the public path at runtime based on the current URL.
* `clean`: Ensures the output directory(`dist`) is cleaned before each build, removing old files.
* `name`: Identifies this container as `host`.
* `remotes`: Specifies remote applications (`client`) with their URLs where the `remoteEntry.js` files are located. These URLs point to the entry points of the remote modules.
* `port`: Runs the development server on port 3000.
* `historyApiFallback`: Ensures the single-page application(SPA) routes are correctly handled by redirecting 404 responses to `index.html`.
* `static`: Serves static files from the `dist` directory.

Step 10:
Create a `Client.js` file inside the src folder in the host application.
```jsx
        import React, { lazy, Suspense } from 'react';

        const Client1 = lazy(()=> import("client/app"));

        const Client = () => {
        return (
            <div>
                <Suspense fallback="Client 1 is loading...">
                    <Client1 />
                </Suspense>
            </div>
        )
        }

        export default Client;
```
**Why we create this file**
* Dynamic Import of Remote Modules:
    Module Federation allows different applications to share and consume modules at runtime. By using `lazy` and dynamic imports(`import("client/app")`), we can load remote modules only when they are needed, which can improve the initial load time of our application.

* Code splitting: 
    The `lazy` function enables code splitting, where the code for the remote component is split into a separate chunk. This chunk in only loaded when the component is rendered, reducing the initial bundle size.

* Asynchronous Loading with Fallback UI:
    The `Suspense` component provides a way to handle asynchronous loading of the remote component by displaying a fallback UI. This ensures that the user experience is smooth, even if there is a delay in loading the remote module.

* Microfrontend Architecture:
    Using Module Federation with `lazy` and `Suspense` supports a microfrontend archetecture, where different parts of the application(microfrontends) can be developed and deployed independently. This approach allows for greater flexibility and scalability in managing large applications.

Step 11:
Create a Layout file named `Root.js` where we can navigate between host and client application components.
```jsx
        import { Link } from "react-router-dom";

        const { Outlet } = require("react-router-dom");

        const Root = () => {
            return (
                <div className="flex flex-row flex-1 h-screen">
                <div className="flex flex-col gap-3 w-60 items-center pt-16 bg-green-200">
                    <Link className="bg-gray-600 px-3 py-2 w-fit text-white" to={"/"}>Home</Link>
                    <Link className="bg-gray-600 px-3 py-2 w-fit text-white" to={"/client1"}>Client 1</Link>
                    <Link className="bg-gray-600 px-3 py-2 w-fit text-white" to={"/client2"}>Client 2</Link>
                </div>
                <div>
                    <Outlet />
                </div>
                </div>
            );
        };
        export default Root;
```

Step 12:
Create another `index.html` file inside src for directing id="root" and bundle.js files.
```jsx
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>React with Webpack</title>
            <base href="/">
        </head>
        <body>
            <div id="root"></div>

            <!-- Notice we are pointing to `bundle.js` file -->
            <script src="bundle.js"></script>
        </body>
        </html>
```

Step 13:
Make necessary changes in the index.js file.
```jsx
        import React from "react";
        import ReactDOM from "react-dom/client";
        import "./index.css";
        import App from "./App";
        import reportWebVitals from "./reportWebVitals";
        import { createBrowserRouter } from "react-router-dom";
        import { RouterProvider } from "react-router-dom";
        import Root from "./Root";
        import Client from "./Client1";
        import Client2 from "./Client2";

        const root = ReactDOM.createRoot(document.getElementById("root"));

        const router = createBrowserRouter([
        {
            path: "/",
            element: (
            <Root/>
            ),
            children: [
            {
                index: true,
                element: <App />,
            },
            {
                path:"client1",
                element: <Client />,
            },
            ],
        },
        ]);

        root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
        );

        // If you want to start measuring performance in your app, pass a function
        // to log results (for example: reportWebVitals(console.log))
        // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
        reportWebVitals();
```
* `createBrowserRouter`: Creates a router with browser history.
* `Router Configuration`: Defines the routes and their respective components:
    * `path:"/"`: The root path.
        * `children`: Nested routes under the root path.
            * `index: true`: The default route under the root path.
            * `element:<App/>`: Renders the `App` component.
        * `path:"client1"`: The path for the first client.
        * `element:<Client/>`: Renders the `Client` component.
* `RouterProvider`: Provides the router context to the application, enabling routing functionalities.

Step 14:
Finally we can start both the client and the host applications with the command `npm run dev` and start the applications.

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

# 3/6/2024 Story Book

# 6/6/2024 Server to Server Module Federation in React

1. Start with npx create-react-app client-app
Same for the host app

2. copy the packages from educative 
Same for the host as well 

3. create a .babelrc file for both the host and client and paste its configuration

4. in client, create a config folder and create webpack.client.js file and also a webpack.server.js and webpack.shared.js and module-federation.js and paste the setting from github

5. make changes in script of package.json from the github s2s 

6. now check error by running the app

7. install pnpm -D @module-federation/enhanced @module-federation/node rimraf

8. pnpm build again to test

9. create to folders client and server inside src and put all the files of src inside client

pnpm build again

10. make index.js middleware.js render.js server.entry.js files and make the required changes from github

11. create components file inside client of src, just move App.js inside it.

12. make required changes inside index.js file for the path

13. pnpm run build again for testing

14. pnpm i express, pnpm i react-helmet

15.  insert plugins for css loader in babel, - pnpm  i -D @babel/plugin-proposal-class-properties, We can install this directly above at first.

16. css loading  inside webpack.shared.js and install pnpm i -D loader css-loader sass-loader

17. pnpm build again to test

18. now again we need svg loader. copy the svg inline loader in webpack.shared.js again and install pnpm i -D svg-inline loader

19. build again to check

20. install pnpm i -D @babel/polyfill and then build again to check

21. if works then pnpm start

22. if we don't have 3000 working it will not work

23. copy all the setting of package.json inside host same as client

24. only change is inside config of webpack.client to port of host link

25. change host port to 3000

26. change module federation of host

27. copy the src folder of client and paste in the host and make changes accordingly

28. change App.js of host

29. change index.js middleware.js render.js of host

30. content.js file inside inside the client_app and paste the required from github

31. make update inside the server folder of client 

32. make folder inside server named as routes and make user.js file and paste required from git

33. copy the babelrc file from client to host

34. run both client and host app to test if its working

35. shared dependencies might clash inside module-federation.js of host so there we need to make required changes by searching eager: true setting

because both react from client and host cannot work together in host, this is context issue(the change is singleton: true)

It should work.

# 7/6/2024 Webpack Configuration in React
Webpack in react is a JavaScript module bundler that is commonly used with React to bundle and manage dependencies. It takes all of the individual JavaScript files and other assets in a project, such as images and CSS, and combines them into a single bundle that can be loaded by the browser.

* Step 1:
`npm init` - This will create a starter package and add a package.json file for us. This is where all the dependencies required to build this application will be mentioned.

* Step 2:
`npm i react react-dom --save` - For creating a simple React application, we need two main libraries, i.e, React and ReactDOM.

* Step 3: 
`npm i webpack webpack-dev-server webpack-cli --save--dev` - For creating webpack, so that we can bundle our app together. Not only bundle, but we will also require hot reloading which is possible using the webpack dev server. The `--save--dev` is to specify that these modules are just dev dependencies. 

* Step 4: 
`npm i babel-core babel-loader @babel/preset-react @babel/preset-env html-webpack-plugin --save-dev` -  To make sure that the code is readable by all browsers, we need a tool like babel to transpile our normal readable code for browsers. 
In the case of babel, we have loaded the core babel library first, then the loader, and finally 2 plugins or presets to work specifically with React and all the new ES2015 and ES6 onwards code.

* Step 5: 
Create a `webpack.config.js` file in the root of the application structure.

```js
            const path = require("path");
            const HtmlWebpackPlugin = require("html-webpack-plugin");

            module.exports = {
                //This property defines where the application starts
                entry: "./src/index.js",

                //This property defines the file path and the file name which will be used for deploying the bundled file
                output: {
                    path: path.join(__dirname, "/dist"),
                    filename: "bundle.js",
                },

                //Setup loaders
                module: {
                    rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                        loader: "babel-loader",
                        },
                    },
                    ],
                },

                // Setup plugin to use a HTML file for serving bundled js files
                plugins: [
                    new HtmlWebpackPlugin({
                    template: "./src/index.html",
                    }),
                ],
            };
```

Here,
1. We start by requiring the default path module to access the file location and make changes to the file location.
2. We require the HTMLWebpackPlugin to generate an HTML file to be used for serving bundled Javascript file/files.
    * Then we have the export.modules object with some properties.
        1. `entry:'./src/index.js'` - It is used to specify which file webpack should start with to get the internal dependency graph created.
        2. 
        ```js
            output:{
                path: path.join(__dirname, '/dist'),
                filename: 'bundle.js'
            },
        ```
        The output property specifying where the bundled file should be generated and what the name of the bundled file would be. This done by the output.path and output.filename properties.
        3. 
        ```js
            module: {
                rules: [
                {
                    test: /\.js$/, 
                    exclude: /node_modules/,
                    use: {
                    loader: 'babel-loader'
                    }
                }
                ]
            }
        ```
        The loaders is to specify what webpack should do for specific type for file. The webpack out of box only understands Javascript and JSON, but if out project has any language used, this would be the place to specify what to do with that new language.
        4. 
        ```js
            plugins: [
                new HtmlWebpackPlugin({
                template: './src/index.html'
                })
            ]
        ```
        Plugins are used to extend the capabilities of webpack. Before a plugin can be used in the plugin array inside the module exports object, we need to require the same.
        This particular plugin will use the specified file in our src folder. It'll then use that as a template for our HTML file where all the bundled files will be automatically injected.

* Step 6:
Create a `.babelrc` file to use the babel preset we installed and take care of the ES6 classes and import statements in our code. Add the following lines of code to the `.babelrc` file.
`"presets": ["@babel/preset-env", "@babel/preset-react"]`

* Step 7:
We start by requiring both React and ReacrDOM inside index.js file in src folder, by adding the below lines -
```jsx
        import React from 'react';
        import ReactDOM from 'react-dom';
        import App from './Components/App';

        ReactDOM.render(<App />, document.getElementById('app'));
```

* Step 8:
Create components folder inside src and create App.js file
```jsx
        import React, { Component } from 'react'

        class App extends Component {
        render() {
            return (
            <div>
                <h1>Webpack + React setup</h1>
            </div>
            )
        }
        }

        export default App;
```

* Step 9:
Now we need to enable hot reloading, in hot reloading every time a change is detected, the browser auto reloads the page and has the ability to build and bundle the entire application when the time comes.
We do this by adding script values in the package.json file. Remove the test property in the scripts object of your package.json file and add these two scripts:
```js
    "start": "webpack-dev-server --mode development --open --hot",
    "build": "webpack --mode production"
```

* Step 10:
Now we can start our reactr project by the command `npm start`, and ones we are ready to get the app bundled we just need to hit the command `npm build`, and webpack will create an optimised bundle in our project folder which we be deployed on any web server. 

# 10/6/2024 Server to Server Module Federation in Nextjs

# nextjs server to server
1. pnpx create-next-app host 
2. pnpm mf nextjs
3. pnpm i webpack
4. change script dev in package.json
5. change the congif.next.js from the github
6. create components folder inside src
7. create content.js file inside components
8. write something inside main.js
9. pnpm dev start in both the host and remote app
10. change inside index.js the host