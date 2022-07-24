import {combineReducers} from '@reduxjs/toolkit';
import attemtResult from './attemtResultSlice';
import testCreatedResult from './testCreatedResultSlice';
import analyticpurchase from './analyticPurchaseSlice';
import tries from './triesSlice';


const analyticsReducers = combineReducers({
    attemtResult,
    testCreatedResult,
    tries,
    analyticpurchase,
});

export default analyticsReducers;
