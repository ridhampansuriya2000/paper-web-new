import {combineReducers} from '@reduxjs/toolkit';
import tests from './testsSlice';
import mainQuestions from './mainQuestionsSlice';
import sections from './sectionsSlice';
import questions from './questionsSlice';

const testReducers = combineReducers({
    tests, mainQuestions, sections, questions
});

export default testReducers;
