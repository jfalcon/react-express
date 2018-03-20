import types from './types';

const initialize = {
  messageData: {
    data: [],
    loading: false,
    error: false
  }
};

// in functional programming, to reduce something is to take an accumulator and apply it against every
// last item in a collection, the idea being to help reduce the complexity of the collection much like
// you would simplify an equation in mathematics, in Redux the concept of a reducer is a pure function
// that takes a previous state and an action, and returns the next simplified (or updated) state

export default function(state = initialize, action) {
  // store state is immutable so we use the spread operator in every action
  // to take all of the properties in the existing Redux store state, along
  // with the new data, and pass them them all into a new object we create
  // a deep copy of before updating the Redux store state
  switch (action.type) {
    case types.FETCH_MESSAGE_DATA_INVOKED:
      return { ...state, messageData: { data: [], loading: true, error: false } };

    case types.FETCH_MESSAGE_DATA_SUCCESS:
      return { ...state, messageData: { data: action.messageDataRaw, loading: false, error: false } };

    case types.FETCH_MESSAGE_DATA_FAILURE:
      return { ...state, messageData: { data: [], loading: false, error: true } };

    default:
      return state;
  }
}
