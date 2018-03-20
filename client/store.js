import { applyMiddleware, createStore } from 'redux'; // Redux routines to help with creating the store
import createSagaMiddleware from 'redux-saga';        // allows us to inject sagas into the store

import rootReducer from './reducers';                 // contains the single entry point for all reducers
import rootSaga from './sagas';                       // allows us to use asynchronous calls for actions

export default function(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  let result = null;

  // use different configurations depending on if this is a development or production build
  '#if process.env.NODE_ENV === "production"';
    result = createStore(
      rootReducer,
      initialState,
      applyMiddleware(sagaMiddleware)
    );
  '#else';
    // do not use import for these since they are dynamic
    const createImmutableStateInvariant = require('redux-immutable-state-invariant').default;
    const createLogger = require('redux-logger').createLogger;

    // redux-immutable-state-invariant is for dev only, it stops us from mutating
    // the store accidentally, but at the cost of a lot of extra overhead
    result = createStore(
      rootReducer,
      initialState,
      applyMiddleware(createImmutableStateInvariant(), createLogger(), sagaMiddleware)
    );
  '#endif';

  // now that we have a store we can initialize the root saga
  sagaMiddleware.run(rootSaga);

  return result;
}
