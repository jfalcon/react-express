import bodyParser from 'body-parser';                 // parse incoming request bodies in specified formats
import express from 'express';                        // middleware framework used for working with HTTP
import compression from 'compression';                // compression middleware for HTTP responses
import helmet from 'helmet';                          // help secure express with various default HTTP headers
import http from 'http';                              // HTTP server for use with Node applications
import session  from 'cookie-session';                // express session support that uses cookies for serialization
import uuid  from 'uuid/v5';                          // fast generation of RFC 4122 compliant UUIDs

import initDatabase from './database';                 // connects us to a database instance
import routes from './routes';                         // maps our routes to service endpoints
import { name, homepage, config } from 'package.json'; // configuration info

/* eslint-disable no-console */

try {
  const server = express();
  server.http = http.createServer(server);

  // setup the server environment for restful requests
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // this middleware will be executed for every request to the server
  server.use((request, response, next) => {
    response.charset = config.charset;

    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.header('Content-Type', 'application/json');

    next();
  });

  // setup a server environment that supports session states
  server.use(session({
    name: name,
    domain: homepage,
    sameSite: true,
    secret: uuid(homepage, uuid.URL), // use a name spaced UUID for the default key name
    secure: false,
    overwrite: true
  }));

  // use different configurations depending on if this is a development or production build
  '#if process.env.NODE_ENV === "production"';
    server.use(compression());
    server.use(helmet());

    // for security reasons do not show error information
    // to STDOUT in production environments
    server.use((error, request, response, next) => {
      // TODO: ...
      response.status(500);

      next();
    });

    // set server options
    server.set('trust proxy', 1);
    server.set('json spaces', 0);
  '#else';
    // set server options
    server.set('trust proxy', 0);
    server.set('json spaces', 2);
  '#endif';

  // this will connect to a database if our service layer requires it
  initDatabase(false, database => {
    // service routing must be setup after the middleware calls above
    server.use('/', routes({ config, database }));

    server.http.listen(config.ports.server || 3000, () => {
      '#if process.env.NODE_ENV !== "production"';
        console.log(`Started server on port ${server.http.address().port}`);
      '#endif';
    });
  });
} catch (ex) {
  console.error(ex.toString());
}
