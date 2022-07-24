import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {attempt} from "../api/schemas";
import _ from "lodash";


export const getAttempts = createAsyncThunk(
  'attempts/getAttempts',
  ({url = null, params}, thunkAPI) => axios.get(url || 'attempts/', {params: url ? null : params})
    .then(({data}) => {
      const {next, count, results} = data;
      const normalized = normalize(results, [attempt])  // normalized: entities, result
      return thunkAPI.fulfillWithValue({next, count, ...normalized})
    })
)

export const getAttempt = createAsyncThunk(
  'attempts/getAttempt',
  (id, thunkAPI) => axios.get(`attempts/${id}/`)
    .then(({data}) => {
      const normalized = normalize(data, attempt)
      return thunkAPI.fulfillWithValue(normalized)
    })
)

const initialState = {
  byId: {},
  all: {
    ids: [],
    next: null,
    count: 0,
    params: {ordering: '-id', limit: 100}
  },
}

const attemptsSlice = createSlice({
  name: 'attempts',
  initialState,
  extraReducers: {
    [getAttempts.fulfilled]: (state, action) => {
      const {url, params} = action.meta.arg
      const {entities, result, next, count} = action.payload;

      state.byId = _.merge(state.byId, entities.attempts);

      state.all = {
        ids: url ? _.union(state.all.ids, result) : result,
        next,
        count,
        params
      }

    },
    [getAttempt.fulfilled]: (state, action) => {
      const {entities} = action.payload;
      state.byId = _.merge(state.byId, entities.attempts);
    }
  }
})


export default attemptsSlice.reducer;


export const selectAttempts = createSelector(
  (state) => state.attempts.byId,
  (state) => state.attempts.all.ids,
  (attempts, ids) => denormalize(ids, [attempt], {attempts})
)

export const selectAttempt = createSelector(
  (state) => state.attempts.byId,
  (state, id) => id,
  (attempts, id) => denormalize(id, attempt, {attempts})
)


/*
*
* Feature
* - ABORT TEST => Just delete all the answers of attempted tests.
* - VIEW RESULT => Display the marks in front of each question + Total Marks
* - GROUP ENROLLED TESTS ✅
* - DASHBOARD [5 EXPLORE TESTS + 5 ATTEMPTED TESTS ✅ + 5 ENROLLED TESTS ✅]
* - FIXED POINTS WHILE ATTEMPT
* - EXPLORE TEST FILTERS [Sort by - Price, filter by course, filter by teacher]
*
* */