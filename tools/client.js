/**
 * Files in the tools folder are not meant to be included into the
 * website directly as they contain ancillary code used by Node.
 */

/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */

import colors from 'colors';    // allows us to colorize console output
import fs from 'fs';            // file system support provided by Node
import express from 'express';  // middleware framework used for working with HTTP
import webpack from 'webpack';  // bundler being used to combine files
import open from 'open';        // opens a file or URL in the default application
import path from 'path';        // path utilities provided by Node

import { isProdMode, NODE_PROD, NODE_DEV } from './utility'; // useful utility functions
import { config } from '../package.json';                    // configuration info

const HTTP_HOST = 'http://localhost';
const HTTP_PORT = config.ports.client || 8080;
const FILE_DEFAULT = (config.defaults.filename || '').trim().toLowerCase();
const FILE_INDEX = `${FILE_DEFAULT}.html`;

// use different configurations depending on if this is a development or production build
const isProd = isProdMode();

console.log(`Serving...`.bold.green);

const client = express();
const clientConfig = require('./compile').client(isProd ? NODE_PROD : NODE_DEV);

if (isProd) {
  // simply serve up static files if they exist in the output folder, nothing fancy required
  client.use(express.static(clientConfig.output.path));

  // invalid requests will simply return the index file from the output folder
  client.get('*', function(req, res) {
    res.sendFile(path.join(clientConfig.output.path, FILE_INDEX));
  });
} else {
  // these will be used later on when routing, defined here for performance reasons
  const indexFile = path.join(clientConfig.output.path, FILE_INDEX);
  const vendorConfig = require('./compile').vendor(isProd ? NODE_PROD : NODE_DEV);
  const vendorFileUri = `${vendorConfig.output.publicPath}${vendorConfig.output.filename}`;

  // the compiler must be dynamically included so we can use dynamic data in the config
  // we need to specify a build mode dynamically into the webpack configuration as well
  const clientCompiler = webpack(clientConfig);

  // we have to filter through webpack in development mode
  const middleware = require('webpack-dev-middleware')(clientCompiler, {
    logLevel: (isProd ? 'error' : 'silent'),   // don't clutter up the console with a wall of text
    publicPath: clientConfig.output.publicPath // specified in the webpack configuration
  });

  // so tell express to run webpack before doing anything
  client.use(middleware);

  // also, tell express to use hot module reloading as well
  client.use(require('webpack-hot-middleware')(clientCompiler));

  // tell express to serve the index file for any invalid request, since this is for a
  // development build, we have to serve it from the webpack in-memory file system
  // note, this will be invoked with every request to express, keep it efficient
  client.get('*', function(request, response) {
    try {
      response.charset = config.charset;

      if (request.url === vendorFileUri) {
        // before returning the index file from memory, we inject the
        // vendor file into memory in order to serve is as well
        response.set('Content-Type', 'application/javascript');
        response.write(fs.readFileSync(path.join(vendorConfig.output.path, vendorConfig.output.filename)));
      } else {
        // simply return the in-memory index file for all other requests
        response.set('Content-Type', 'text/html');
        response.write(middleware.fileSystem.readFileSync(indexFile));
      }
    } catch (ex) {
      console.error(('Memory File System ' + ex.toString() + `\n${indexFile}`).bold.red);

      response.set('Content-Type', 'text/plain');
      response.write(ex.toString());
    }

    response.end();
  });
}

// now we open up the user's default browser and tell express to listen to HTTP traffic
client.listen(HTTP_PORT, function(err) {
  if (err) {
    console.error(err);
  } else {
    open(`${HTTP_HOST}:${HTTP_PORT}`);
  }
});
