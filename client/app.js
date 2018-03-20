import React from 'react';                            // main React include that is the stub for all
import ReactDOM from 'react-dom';                     // main React include for website development
import { AppContainer } from 'react-hot-loader';      // we have to include to support HMR with React
import { Provider } from 'react-redux';               // bindings to connect the Redux store to React
import { IntlProvider } from 'react-intl';            // internationalization / localization for React

import Routes from 'containers/routes';               // set up global routes the application uses
import configureStore from 'store';                   // import the single store Redux will use
import './app.scss';                                  // entry point for global styles in the application

// wrapped in a routine to control when it gets executed
const runApplication = async function(store) {
  // if the browser doesn't support Intl (i.e. Safari) then we manually polyfill it
  // we won't know this until the browser is running so code-split / lazy load it
  if (!window.intl) {
    // doing this will cause these files to be loaded into a single separate chunk
    // note, one of these imports have to match the default locale in package.json
    // note, dynamic imports don't easily support variables for a path
    await import(/* webpackChunkName: "intl" */ 'intl');
    await import(/* webpackChunkName: "intl" */ 'intl/locale-data/jsonp/en-US.js');
  }

  // still code-split / lazy load the regular localization since this file can grow
  // note, dynamic imports don't easily support variables for a path
  const messages = await import(/* webpackChunkName: "intl" */ 'locales/en-us.json');

  window.onload = () => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <IntlProvider locale="en-US" messages={messages}>
            <Routes />
          </IntlProvider>
        </Provider>
      </AppContainer>,

      // document.querySelector requires at least IE8 support
      document.querySelector('body > main#application'),

      // now we can finally dismiss the page loader
      () => document.querySelector('body > section#page-loader').classList.add('hide')
    );
  };
};

// run the application after the browser check has been done
// also, we always have at least one locale by default
runApplication(configureStore());
