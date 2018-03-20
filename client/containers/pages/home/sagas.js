import { call, put, takeLatest } from 'redux-saga/effects';
import MessageService from 'services/message';
import * as actions from './actions';
import types from './types';

// in computer science, a saga is a design pattern that refers to a long running process
// of distributed transactions occurring within it during any given time, much like the
// textbook definition of a saga which is a long, involved story, or series of incidents

// this is a saga worker function, implemented as a generator routine
// do not export this as it matches the action creator name on purpose
function* fetchMessageData() {
  try {
    // put simply calls an action, have it filter through our action creators
    yield put(actions.fetchMessageDataInvoked());

    const messageDataRaw = yield call(() => {
      return MessageService.fetchData();
    });

    yield put(actions.fetchMessageDataSuccess(messageDataRaw));
  } catch (ex) {
    yield put(actions.fetchMessageDataFailure());
  }
}

// this is the watch function for the file, all sagas needs to be included inside it
// also, takeLatest does not allow for concurrent fetches, if an action is dispatched
// while a fetch is pending the pending fetch is canceled and the latest one is ran
export default function*() {
  yield takeLatest(types.FETCH_MESSAGE_DATA, fetchMessageData);
}
