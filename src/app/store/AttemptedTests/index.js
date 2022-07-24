import {combineReducers} from '@reduxjs/toolkit';
import attemtedTestsSlice from './attemtedTestsSlice';

const attemtedTestTeacherReducers = combineReducers({
    attemtedTestsSlice
});

export default attemtedTestTeacherReducers;
