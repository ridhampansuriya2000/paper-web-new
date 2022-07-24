import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

export const getTestsForTeacher = createAsyncThunk(
  'attempted/getTests',
  ({url = null, params, type = 'all'}, thunkAPI) => axios.get(url || `tests/?ordering=-id&limit=40&teacher=${params.teacherId}&search=`, {params:null})
    .then(({data}) => {
      const {results, next, count} = data;
      return thunkAPI.fulfillWithValue({results, next, count})
    })
)

export const getAttemptsStudentList = createAsyncThunk(
    'attempted/getStudentsList',
    ({url = null, params, type = 'all'}, thunkAPI) => axios.get(url || `/test/attempted/student/${params.testId}/`)
        .then((res) => {
            const {data : {data}} = res;
            return thunkAPI.fulfillWithValue(data)
        })
)

export const getAttemptsList = createAsyncThunk(
  'attempted/getStudentsList/getAttemptsList',
  ({testId,studentId}, thunkAPI) => axios.get(`/get/student/test/attempts/${testId}/${studentId}/`)
    .then(({data}) => {
      // const {entities} = normalize(data, test)
      return thunkAPI.fulfillWithValue(data)
    })
)

const initialState = {
    attemptedTests : {
        next: null,
        count: 0,
        previous: null,
        results: []
    },
  studentList : [],
    attemtedList : []
}

const attemtedTestsSlice = createSlice({
  name: 'attempted/tests',
  initialState,
  reducers: {
    onMainQuestionAdd: (state, action) => {
      const {id, test} = action.payload
      state.byId[test].main_questions = _.union(state.byId[test].main_questions, [id])
    },
  },
  extraReducers: {
    [getTestsForTeacher.fulfilled]: (state, action) => {
      const {results, next, count} = action.payload;
      // const {url, params, type="attempted"} = action.meta.arg;
        state.attemptedTests = {
            next,
            count: 0,
            previous : null,
            results : results
        }
    },
      [getAttemptsStudentList.fulfilled]: (state, action) => {
          const data = action.payload;
          console.log("reducer",action.payload,data)
          let attempts = data;
          state.studentList = attempts;
      },
    [getAttemptsList.fulfilled]: (state, action) => {
      const {data} = action.payload;
      state.attemtedList = data;
    }

  }
})

export const testsActions = attemtedTestsSlice.actions;
export default attemtedTestsSlice.reducer;


export const selectAttemtedTestsForTeacher = createSelector(
    (state) => state.attemtedTestTeacherReducers.attemtedTestsSlice.attemptedTests.results,
    (results) =>(results))

export const selectStudentList = createSelector(
    (state) => state.attemtedTestTeacherReducers.attemtedTestsSlice.studentList,
    (results) =>(results))

export const selectAttemtedList = createSelector(
    (state) => state.attemtedTestTeacherReducers.attemtedTestsSlice.attemtedList,
    (results) =>(results))




