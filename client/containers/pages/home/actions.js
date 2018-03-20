import types from './types';

// actions change things in the application, since we're using a unidirectional data flow
// the action creators below are the only way the application interacts with Redux state

export function fetchMessageData() {
  return { type: types.FETCH_MESSAGE_DATA };
}

export function fetchMessageDataInvoked() {
  return { type: types.FETCH_MESSAGE_DATA_INVOKED };
}

export function fetchMessageDataSuccess(messageDataRaw) {
  return { type: types.FETCH_MESSAGE_DATA_SUCCESS, messageDataRaw };
}

export function fetchMessageDataFailure() {
  return { type: types.FETCH_MESSAGE_DATA_FAILURE };
}
