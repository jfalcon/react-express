/**
 * Files in the tools folder are not meant to be included into the
 * website directly as they contain ancillary code used by Node.
 */

/* eslint-disable no-undef */
/* eslint-disable no-var */

// this file is written in ES5 since it's not transpiled by Babel
// but we still use babel to transpile the tests themselves
require('babel-register')();

// disable webpack-specific features since Mocha doesn't know what to do with them
require.extensions['.css'] = function() { return null; };
require.extensions['.png'] = function() { return null; };
require.extensions['.jpg'] = function() { return null; };

// we use JSDOM to create an in-memory DOM that will allow the testing
// of React components without having to actually open up the browser
var JSDOM = require('jsdom').JSDOM;
var JSDOMData = require('../node_modules/jsdom/package.json');

// we simulate these in our virtual DOM since React expects them
var exposedProperties = ['window', 'navigator', 'document'];

// setup the simplest document possible
var dom = new JSDOM
(
   '<!doctype html><html><body></body></html>',
   {
      includeNodeLocations: true,
      url: 'http://localhost/',
      userAgent: process.release.name + '/' + process.version + ' (' +
                 process.platform + ') ' + JSDOMData.name + '/' + JSDOMData.version
   }
);

// set the window and document objects globally as you would expect in a browser
global.window = dom.window;
global.navigator = dom.navigator;
global.document = window.document;

// take the remaining properties of the window object and attach them to the mocha global object
Object.keys(dom.window).forEach((property) => {
   if (typeof global[property] === 'undefined') {
      exposedProperties.push(property);
      global[property] = dom.window[property];
   }
});
