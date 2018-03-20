/**
 * Files in the tools folder are not meant to be included into the
 * website directly as they contain ancillary code used by Node.
 */

/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */

import colors from 'colors';                                 // colorize console output
import path from 'path';                                     // path utilities provided by Node
import webpack from 'webpack';                               // bundler used to compile files
import { isProdMode, NODE_PROD, NODE_DEV } from './utility'; // useful utility functions
import { config } from '../package.json';                    // configuration info

try {
  // use different configurations depending on if this is a development or production build
  const isProd = isProdMode();

  // wrap the functionality of running the compiler so we can run multiple jobs synchronously
  const run = (compiler, callback) => {
    compiler.run((error, stats) => {
      // if a fatal error occurred then bail out early
      if (error) {
        console.log((error || '').toString().trim().bold.red);
        return 1;
      }

      const jsonStats = stats.toJson();

      // if the stats also report an error we bail out as well
      if (jsonStats.hasErrors) {
        return jsonStats.errors.map(error => console.log((error || '').toString().trim().bold.red));
      }

      // continue despite warnings, but let somebody know what's up
      if (jsonStats.hasWarnings) {
        jsonStats.warnings.map(warning => console.log((warning || '').toString().trim()));
      }

      if (typeof callback === 'function') callback();
      return 0;
    });
  };

  // the compiler must be dynamically included so we can use dynamic data in the config
  // we need to specify a build mode dynamically into the webpack configuration as well
  const compilerConfig = require('./compile');

  // run the static compilation process for vendor always, serverConfig
  // and clientConfig are only built statically for a production build
  const vendorConfig = compilerConfig.vendor(isProd ? NODE_PROD : NODE_DEV);

  if (isProd) {
    const serverConfig = compilerConfig.server(isProd ? NODE_PROD : NODE_DEV);
    const clientConfig = compilerConfig.client(isProd ? NODE_PROD : NODE_DEV);

    run(webpack(vendorConfig), () => {
      run(webpack(serverConfig), () => {
        run(webpack(clientConfig));
      });
    });
  } else {
    run(webpack(vendorConfig));
  }
} catch (ex) {
  console.log(ex.toString().bold.red);
}
