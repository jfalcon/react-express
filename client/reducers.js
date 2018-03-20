import { combineReducers } from 'redux';
import homeReducer from 'containers/pages/home/reducer';

// in functional programming, to reduce something is to take an accumulator and apply it against every
// last item in a collection, the idea being to help reduce the complexity of the collection much like
// you would simplify an equation in mathematics, in Redux the concept of a reducer is a pure function
// that takes a previous state and an action, and returns the next simplified (or updated) state

// this is the single entry point for all reducers
export default combineReducers({
  home: homeReducer
});
