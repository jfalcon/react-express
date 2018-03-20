import { all } from 'redux-saga/effects';
import homeSagas from 'containers/pages/home/sagas';

// in computer science, a saga is a design pattern that refers to a long running process
// of distributed transactions occurring within it during any given time, much like the
// textbook definition of a saga which is a long, involved story, or series of incidents

// this is the single entry point for all sagas
export default function*() {
  yield all([
    homeSagas()
  ]);
}
