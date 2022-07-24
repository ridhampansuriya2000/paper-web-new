import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import fuse from './fuse';
import i18n from './i18nSlice';
import testReducers from './test'
import analyticsReducers from './Analytics'
import courses from './coursesSlice'
import transactions from './transactionsSlice'
import attempts from './attemptsSlice'
import charts from './dashboardSlice'
import attemtedTestTeacherReducers from './AttemptedTests'
import filter from "./filterSlice";

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    auth,
    fuse,
    i18n,
    test: testReducers,
    analyticsResult: analyticsReducers,
    courses,
    transactions,
    attempts,
    filter,
    charts,
    attemtedTestTeacherReducers,
    ...asyncReducers,
  });

  /*
	Reset the redux store when user logged out
	 */
  if (action.type === 'auth/user/userLoggedOut') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
