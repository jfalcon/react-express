/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */

import colors from 'colors';   // colorize console output
import path from 'path';       // path utilities provided by Node
import webpack from 'webpack'; // bundler being used to bundle files

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import { browserslist } from 'bootstrap/package.json';      // auto prefixer configuration info
import { name as siteName, config } from '../package.json'; // main configuration info
import { NODE_ENV, NODE_DEV, NODE_PROD } from './utility';  // help determine the build mode

const DIR_CLIENT = config.directories.source.client;
const DIR_SERVER = config.directories.source.server;
const DIR_DIST = config.directories.output;
const DIR_NODE = config.directories.modules;

const NAME_APP = 'app';
const NAME_INDEX = (config.defaults.filename || '').trim().toLowerCase();
const NAME_CHUNK = 'chunk';
const NAME_VENDOR = 'vendor';

const PATH_DIST = path.resolve(__dirname, '..', DIR_DIST);
const PATH_NODE = path.resolve(__dirname, '..', DIR_NODE, siteName);
const PATH_CLIENT = path.resolve(__dirname, '..', DIR_CLIENT);
const PATH_SERVER = path.resolve(__dirname, '..', DIR_SERVER);
const PATH_PUBLIC = '/';

const MANIFEST_OUTPUT = path.join(PATH_NODE, `${NAME_VENDOR}.json`);
const SCRIPT_APP_OUTPUT = `${NAME_APP}.js`;
const SCRIPT_INDEX_OUTPUT = `${NAME_INDEX}.js`;
const SCRIPT_CHUNK = `${NAME_CHUNK}.[name].js`;
const SCRIPT_EJS = path.join(PATH_CLIENT, `${NAME_INDEX}.ejs`);
const SCRIPT_CLIENT_ENTRY = path.resolve(PATH_CLIENT, `${NAME_APP}.js`);
const SCRIPT_SERVER_ENTRY = path.resolve(PATH_SERVER, `${NAME_INDEX}.js`);
const SCRIPT_VENDOR_OUTPUT = `${NAME_VENDOR}.js`;
const STYLE_OUTPUT = `${NAME_APP}.css`;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// these plug-ins will be loaded for all builds
const webpackBasePlugins = isProd => {
  let definitions = {};

  // we should always use the utility functions rather than set this directly when in
  // the tools folder, however code inside the application itself does not have access
  // to the utilities in this folder, so libraries such as React, etcetera are unaware of
  // them. this allows them to perform whatever steps are necessary for production builds
  definitions[`process.env.${NODE_ENV}`] = JSON.stringify(isProd ? NODE_PROD : NODE_DEV);

  // order is important
  return isProd ? [
    new webpack.optimize.OccurrenceOrderPlugin(),  // prioritize often used modules by assigning them the smallest ids
    new webpack.DefinePlugin(definitions),         // provides predefined utility code for the application
    new webpack.optimize.DedupePlugin()            // eliminate duplicate packages in the final bundle
  ] : [
    new webpack.DefinePlugin(definitions)          // provides predefined utility code for the application
  ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*/
/ / Since we make such a big deal about fonts below, it's worth explaining them a bit.
/ /
/ / WOFF is essentially a wrapper that contains SFNT-based fonts (TrueType or OpenType) that have been
/ / compressed using a WOFF encoding tool to enable them to be embedded in a Web page. The format uses
/ / zlib compression typically resulting in a file size reduction from TTF of over 40%. Like OpenType
/ / fonts, WOFF supports both PostScript and TrueType outlines for the glyphs.
/ /
/ / WOFF2 is a newer version of WOFF that provides for better compression.
/ /
/ / Embedded OpenType (EOT) fonts are a compact form of OpenType fonts designed by Microsoft for use
/ / as embedded fonts on web pages. They are supported only by Microsoft Internet Explorer.
/ /
/ / SVG fonts are a subset of the Scalable Vector Graphics (SVG) 1.1 specification, which is an XML-based
/ / vector image format for two-dimensional graphics with support for animation. It was developed by the
/ / World Wide Web Consortium (W3C) in 1999. Use of this as a standalone font is now deprecated since
/ / most browsers support embedding of SVG fonts inside the OpenType and WOFF supersets. As such, all
/ / SVG files included here should really be actual images rather than a font file.
/*/

const clientLoaders = isProd => {
  // loader configurations to preprocess styles into vanilla CSS with vendor prefixes
  const styleLoaders = [{
    loader: 'css-loader',                          // treats @import and url() as CommonJS modules
      options: {
        importLoaders: 2,                          // use both sass and postcss loaders when importing
        minimize: isProd,
        sourceMap: false
      }
    }, {
      loader: 'postcss-loader',                    // allows us to transform styles via scripts
      options: {
        plugins: [
          require('postcss-flexbugs-fixes'),
          require('autoprefixer')({ browsers: browserslist })
        ],
        sourceMap: false
      }
    }, {
      loader: 'sass-loader',                       // compiles SASS to CSS
      options: { sourceMap: false }
  }];

  // for production builds we put the styles in a separate file
  const styleLoaderConfig = isProd ?
  ExtractTextPlugin.extract({
     fallback: 'style-loader',                     // fall back to injecting CSS into the page via a style tag
     use: styleLoaders
  }) : [
     { loader: 'style-loader' },                   // injects CSS into a page via a style tag
     ...styleLoaders                               // order is very important for this
  ];

  return {
    loaders: [{
      test: /\.(css|scss|sass)$/,
      use: styleLoaderConfig
    }, {
      test: /\.jsx?$/,
      use: [isProd ? 'babel-loader' : 'babel-loader?cacheDirectory=true']
    }, {
      test: /\.(jpe?g|png|gif|ico)((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'file-loader',
        options: {
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }, {
      test: /\.svg((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'url-loader',
        options: {
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          limit: 10240,                              // anything under 10 KiB is embedded as a data url
          mimetype: 'image/svg+xml',                 // established circa August 2011 by W3C
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }, {
      test: /\.eot((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'url-loader',
        options: {
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          limit: 10240,                              // anything under 10 KiB is embedded as a data url
          mimetype: 'application/vnd.ms-fontobject', // established circa December 2005 by IANA
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }, {
      test: /\.woff((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'url-loader',
        options: {                                   // Web Open Font Format (WOFF)
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          limit: 10240,                              // anything under 10 KiB is embedded as a data url
          mimetype: 'application/font-woff',         // font/woff isn't widely supported yet (Feb 2017 IETF)
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }, {
      test: /\.woff2((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'url-loader',
        options: {                                   // Web Open Font Format (WOFF) 2.0
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          limit: 10240,                              // anything under 10 KiB is embedded as a data url
          mimetype: 'application/font-woff2',        // font/woff2 isn't widely supported yet (Feb 2017 IETF)
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }, {
      test: /\.otf((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'url-loader',
        options: {                                   // OpenType Font Format (Adobe and Microsoft 1996)
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          limit: 10240,                              // anything under 10 KiB is embedded as a data url
          mimetype: 'application/x-font-opentype',   // font/otf isn't widely supported yet (Feb 2017 IETF)
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }, {
      test: /\.ttf((\?|(\??#))[.a-z0-9]+)?$/i,
      use: [{
        loader: 'url-loader',
        options: {                                   // TrueType Font Format (Apple and Microsoft 1980s)
          context: `${DIR_CLIENT}/`,                 // requires an ending slash to create a directory
          limit: 10240,                              // anything under 10 KiB is embedded as a data url
          mimetype: 'application/x-font-truetype',   // font/ttf isn't widely supported yet (Feb 2017 IETF)
          name: '[path][name].[ext]'                 // used with the context to keep directory structure
        }
      }]
    }]
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.server = env => {
  // use different configurations depending on if this is a development or production build
  const isProd = (env === NODE_PROD);

  // specify the directories needed below
  const outputBase = path.join(PATH_DIST, DIR_SERVER);
  const contentBase = isProd ? outputBase : PATH_SERVER;

  // which webpack plug-ins to load for the build (more will be added below)
  const basePlugins = webpackBasePlugins(isProd);

  // which webpack plug-ins to load for the build (more will be added below)
  const serverPlugins = isProd ? [
    new ProgressBarPlugin({
      clear: true,
      summary: false,
      summaryContent: `Built ${DIR_SERVER} `.gray,
      format: `Building ${DIR_SERVER}...`.bold.green + ' [:bar] :percent'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
        beautify: false
      },
      sourceMap: false,
      test: /\.jsx?$/
    })
  ] : [
    new ProgressBarPlugin({
      clear: true,
      summary: false,
      summaryContent: `Built ${DIR_SERVER} `.gray,
      format: `Building ${DIR_SERVER}...`.bold.green + ' [:bar] :percent'
    })
  ];

  // the actual configuration object
  return {
    name: DIR_SERVER,                              // reference name of this bundle configuration
    devtool: '(none)',                             // tells webpack how to handle source mappings
    target: 'node',                                // compiles for usage in a Node-like environment
    entry: [
      'babel-polyfill',                            // necessary for a full ES6 implementation through Babel
      'isomorphic-fetch',                          // adds a global fetch so it's consistent between client and server
      'sprintf-js',                                // globally make available string formatting routines
      SCRIPT_SERVER_ENTRY                          // the entry point is just one file for services
    ],
    output: {
      path: outputBase,                            // where physical files will be placed for builds
      publicPath: PATH_PUBLIC,                     // required for hot reloading to work with nested routes
      filename: SCRIPT_INDEX_OUTPUT                // main script filename for in-memory or production builds
    },
    devServer: {
      contentBase: contentBase,                    // specifies the directory where the application resides
      publicPath: PATH_PUBLIC,                     // must match output.publicPath for consistency for HMR to work
      stats: 'errors-only'                         // only show error information output to the console
    },
    plugins: basePlugins.concat(serverPlugins),    // both basePlugins and serverPlugins are defined above
    module: {                                      // don't use clientLoaders as we want a minimal build for the server
      loaders: [{
        test: /\.jsx?$/,
        use: [isProd ? 'babel-loader' : 'babel-loader?cacheDirectory=true']
      }]
    }
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.vendor = env => {
  // use different configurations depending on if this is a development or production build
  const isProd = (env === NODE_PROD);

  // specify the directories needed below
  const outputBase = isProd ? path.join(PATH_DIST, DIR_CLIENT) : PATH_NODE;

  // defines the base dependences that will end up in the vendor output file
  // order is important and they are included globally and always present
  const entryPoints = [
    'babel-polyfill',                             // necessary for a full ES6 implementation through Babel
    'bootstrap.native/dist/bootstrap-native-v4',  // a native implementation of bootstrap controls without jQuery
    'flexibility',                                // a flexbox polyfill for older browsers
    'history',                                    // manage session history consistently across browsers
    'intl',                                       // internationalization polyfill for old browsers
    'react',                                      // the main include for React
    'react-dom',                                  // the main include for React over the web
    'react-intl',                                 // internationalization support for React
    'react-router',                               // a router implementation for React
    'react-router-dom',                           // a router implementation for React over the web
    'redux',                                      // main include for Redux
    'react-redux',                                // bindings for Redux with React
    'react-router-redux',                         // bindings for Redux with the React router
    'redux-thunk',                                // asynchronous thunking support to Redux
    'prop-types',                                 // runtime type checking for React props
    'sprintf-js',                                 // globally make available string formatting routines
    'whatwg-fetch'                                // a windows.fetch polyfill for old browsers
  ];

  // which webpack plug-ins to load for the build (more will be added below)
  const basePlugins = webpackBasePlugins(isProd);

  // which webpack plug-ins to load for the build (more will be added below)
  const vendorPlugins = isProd ? [
    new ProgressBarPlugin({
      clear: true,
      summary: false,
      summaryContent: `Built ${NAME_VENDOR} `.gray,
      format: `Building ${NAME_VENDOR}...`.bold.green + ' [:bar] :percent'
    }),
    new webpack.DllPlugin({
      name: `${NAME_VENDOR}_[hash]`,               // name of global variable the library's require() has been assigned
      path: MANIFEST_OUTPUT                        // this path should be absolute
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
        beautify: false
      },
      sourceMap: false,
      test: /\.jsx?$/
    })
  ] : [
    new ProgressBarPlugin({
      clear: true,
      summary: false,
      summaryContent: `Built ${NAME_VENDOR} `.gray,
      format: `Building ${NAME_VENDOR}...`.bold.green + ' [:bar] :percent'
    }),
    new webpack.DllPlugin({
      name: `${NAME_VENDOR}_[hash]`,               // name of global variable the library's require() has been assigned
      path: MANIFEST_OUTPUT                        // this path should be absolute
    })
  ];

  // the actual configuration object
  return {
    name: NAME_VENDOR,                             // reference name of this bundle configuration
    devtool: '(none)',                             // tells webpack how to handle source mappings
    target: 'web',                                 // compiles for usage in a browser-like environment
    entry: entryPoints,                            // the application entry points webpack will use
    output: {
      path: outputBase,                            // where physical files will be placed for builds
      publicPath: PATH_PUBLIC,                     // required for hot reloading to work with nested routes
      filename: SCRIPT_VENDOR_OUTPUT,              // main script filename for in-memory or production builds
      library: `${NAME_VENDOR}_[hash]`             // name of global variable the library's require() will be assigned
    },
    plugins: basePlugins.concat(vendorPlugins),    // both basePlugins and vendorPlugins are defined above
    module: clientLoaders(isProd)                  // clientLoaders is defined above
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.client = env => {
  // use different configurations depending on if this is a development or production build
  const isProd = (env === NODE_PROD);

  // optimize the source mapping for build speed
  const sourceMap = isProd ? '(none)' : 'eval';

  // specify the directories needed below
  const outputBase = path.join(PATH_DIST, DIR_CLIENT);
  const contentBase = isProd ? outputBase : PATH_CLIENT;

  // which webpack plug-ins to load for the build (more will be added below)
  const basePlugins = webpackBasePlugins(isProd);

  // inject useful values into the config object to pass along to our template
  config.files = {
    base: PATH_PUBLIC,
    style: `${PATH_PUBLIC}${NAME_APP}.css`,
    vendor: `${PATH_PUBLIC}${NAME_VENDOR}.js`,
    app: `${PATH_PUBLIC}${NAME_APP}.js`
  };

  // which webpack plug-ins to load for the build (more will be added below)
  const clientPlugins = isProd ? [
    new ProgressBarPlugin({
      clear: true,
      summary: false,
      summaryContent: `Built ${DIR_CLIENT} `.gray,
      format: `Building ${DIR_CLIENT}...`.bold.green + ' [:bar] :percent'
    }),
    new ExtractTextPlugin({                             // extract styles from the bundle into a separate file
      filename: STYLE_OUTPUT,
      allChunks: true
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: MANIFEST_OUTPUT                         // this path should be absolute
    }),
    new webpack.ProvidePlugin({                         // auto load these modules instead of importing everywhere
      bsn: 'bootstrap.native/dist/bootstrap-native-v4'  // required for bootstrap 4 native to function
    }),
    new HtmlWebpackPlugin({                             // automatically create an index.html file
      customData: {
        config: config,
        files: {
          style: `${PATH_PUBLIC}${NAME_APP}.css`,
          vendor: `${PATH_PUBLIC}${NAME_VENDOR}.js`,
          script: `${PATH_PUBLIC}${NAME_APP}.js`
        },
        paths: {
          local: PATH_CLIENT,
          public: PATH_PUBLIC
        },
        separator: path.sep
      },
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      template: SCRIPT_EJS
    }),
    new webpack.optimize.UglifyJsPlugin({               // removes dead code and minifies the final JavaScript output
      sourceMap: true,
      test: /\.jsx?$/
    })
  ] : [
    new webpack.HotModuleReplacementPlugin(),           // enables Hot Module Replacement (HMR)
    new StyleLintPlugin({                               // enable in-browser only linting for styles
      emitErrors: false,
      failOnError: false,
      quiet: true,
      syntax: 'scss'
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: MANIFEST_OUTPUT                         // this path should be absolute
    }),
    new webpack.ProvidePlugin({                         // auto load these modules instead of importing everywhere
      bsn: 'bootstrap.native/dist/bootstrap-native-v4'  // required for bootstrap 4 native to function
    }),
    new HtmlWebpackPlugin({                             // automatically create an index.html file
      customData: {
        config: config,
        files: {
          vendor: `${PATH_PUBLIC}${NAME_VENDOR}.js`,
          script: `${PATH_PUBLIC}${NAME_APP}.js`
        },
        paths: {
          local: PATH_CLIENT,
          public: PATH_PUBLIC
        },
        separator: path.sep
      },
      inject: false,
      template: SCRIPT_EJS
    })
  ];

  // blah blah
  const baseEntryPoints = isProd ? [
    'babel-polyfill',                              // necessary for a full ES6 implementation through Babel
    'react-hot-loader'                             // add this also in prod (but disabled) so syntax isn't messed up
  ] : [
    'babel-polyfill',                              // necessary for a full ES6 implementation through Babel
    'react-hot-loader/patch',                      // allows components to be hot reloaded without loss of state
    'webpack-hot-middleware/client?reload=true'    // this will reload the page if hot module reloading fails
  ];

  // the actual configuration object
  return {
    cache: !isProd,                                // production is always a full build
    name: NAME_APP,                                // reference name of this bundle configuration
    dependencies: [NAME_VENDOR],                   // check vendor first for files before adding
    devtool: sourceMap,                            // tells webpack how to handle source mappings
    target: 'web',                                 // compiles for usage in a browser-like environment
    entry: baseEntryPoints.concat([
      'sprintf-js',                                // globally make available string formatting routines
      'whatwg-fetch',                              // a windows.fetch polyfill for old browsers
      SCRIPT_CLIENT_ENTRY                          // the entry point is just one file for a SPA
    ]),
    output: {
      path: outputBase,                            // where physical files will be placed for builds
      publicPath: PATH_PUBLIC,                     // required for hot reloading to work with nested routes
      filename: SCRIPT_APP_OUTPUT,                 // main script filename for in-memory or production builds
      chunkFilename: SCRIPT_CHUNK                  // chunk script filename for in-memory or production builds
    },
    devServer: {
      contentBase: contentBase,                    // specifies the directory where the application resides
      publicPath: PATH_PUBLIC,                     // must match output.publicPath for consistency for HMR to work
      stats: 'errors-only'                         // only show error information output to the console
    },
    plugins: basePlugins.concat(clientPlugins),    // both basePlugins and clientPlugins are defined above
    module: clientLoaders(isProd)                  // clientLoaders is defined above
  };
};
