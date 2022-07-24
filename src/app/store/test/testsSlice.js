import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {test} from "../../api/schemas";
import _ from "lodash";
import {showMessage} from "../fuse/messageSlice";
// import {deleteSection} from "./sectionsSlice";

export const getTests = createAsyncThunk(
  'test/tests/getTests',
  ({url = null, params, type = 'all'}, thunkAPI) => axios.get(url || 'tests/', {params: url ? null : params})
    .then( async ({data}) => {
      const {results, next, count} = data;
        const list = await axios.get( `tests/extradata/`, {params:null}).then(({data})=>{
            return data.results;
        })
      const {result, entities} = normalize(results, [test])
      return thunkAPI.fulfillWithValue({ids: result, ...entities, list, next, count});
    })
)

export const getAttempts = createAsyncThunk(
    'test/tests/getAttempts',
    ({url = null, params, type = 'all'}, thunkAPI) => axios.get(url || `test/attempts/${params.testId}`)
        .then((res) => {
            const {data} = res;
            // const {result} = normalize(data, [test])
            return {data : data}
            // return thunkAPI.fulfillWithValue({data : result})
        })
)

export const getTest = createAsyncThunk(
  'test/tests/getTest',
  ({id}, thunkAPI) => axios.get(`tests/${id}/`)
    .then(({data}) => {
      const {entities} = normalize(data, test)
      return thunkAPI.fulfillWithValue({...entities})
    })
)

export const createTest = createAsyncThunk(
  'test/tests/createTest',
  (data, thunkAPI) => axios.post('tests/', data)
    .then(({data}) => {

      // show message
      thunkAPI.dispatch(showMessage({
        message: 'Test created!',
        variant: 'success'
      }))

      const normalized = normalize(data, test)
      return thunkAPI.fulfillWithValue(normalized)
    }).catch(err => {
      // show message
      thunkAPI.dispatch(showMessage({
        message: err?.response?.data?.message ?? 'Test create error',
        variant: 'error'
      }))
      throw Error
    })
)

export const updateTest = createAsyncThunk(
  'test/tests/updateTest',
  (data, thunkAPI) => axios.patch(`tests/${data.id}/`, data)
    .then(({data}) => {

      // show message
      thunkAPI.dispatch(showMessage({
        message: 'Test updated!',
        variant: 'success'
      }))

      const normalized = normalize(data, test)
      return thunkAPI.fulfillWithValue(normalized)
    }).catch(err => {
      // show message
      thunkAPI.dispatch(showMessage({
        message: err?.response?.data?.message ?? 'Test update error',
        variant: 'error'
      }))
      throw Error
    })
)

export const deleteTest = createAsyncThunk(
    'test/tests',
    (id, thunkAPI) => axios.delete(`tests/${id}`)
        .then(()=>{
            // show message
            thunkAPI.dispatch(showMessage({
                message: 'Test deleted!',
                variant: 'success'
            }))
        }).catch(err=>{
            // show message
            thunkAPI.dispatch(showMessage({
                message:err?.response?.data?.message??'Test delete error',
                variant:'error'
            }))
            throw Error

        })
)

export const publishTest = createAsyncThunk(
    'test/test',
    (obj, thunkAPI) => axios.get(`test/${obj.id}/${obj.publish}/`)
        .then((res)=>{
            // show message
            thunkAPI.dispatch(showMessage({
                message: res.data.message,
                variant: 'success'
            }))
            return res;
        }).catch(err=>{
            // show message
            thunkAPI.dispatch(showMessage({
                message:err?.response?.data?.message??'Test Publish error',
                variant:'error'
            }))
            throw Error

        })
)

const initialState = {
  byId: {},
  all: {
    ids: [],
    next: null,
    count: 0,
    params: {ordering: '-id', limit: 40}
  },
  enrolled: {
    ids: [],
    next: null,
    count: 0,
    params: {ordering: '-id', limit: 10, enrolled: true}
  },
  attempted: {
    ids: [],
    next: null,
    count: 0,
      list :[],
    params: {ordering: '-id', limit: 10, attempted: true}
  },
    extraattempted : [],
    attempts:{
      data:[]
    }
}

const testsSlice = createSlice({
  name: 'test/tests',
  initialState,
  reducers: {
    onMainQuestionAdd: (state, action) => {
      const {id, test} = action.payload
      state.byId[test].main_questions = _.union(state.byId[test].main_questions, [id])
    },
  },
  extraReducers: {
    [getTests.fulfilled]: (state, action) => {
      const {ids, tests, next, count, list} = action.payload;
      const {url, params, type="all"} = action.meta.arg;

      state.byId = _.merge(state.byId, tests);
        // console.log(type)
      switch (type) {
        case 'all':
          state.all = {
            ids: url ? _.union(state.all.ids, ids) : ids,
            next,
            params,
            count
          }
          break;
        case 'enrolled':
          state.enrolled = {
            ids: url ? _.union(state.enrolled.ids, ids) : ids,
            next,
            params,
            count
          }
          break;
        case 'attempted':
          state.attempted = {
            ids: url ? _.union(state.attempted.ids, ids) : ids,
            next,
            params,
            count,
              list
          }
          break;
      }
    },
      [getAttempts.fulfilled]: (state, action) => {
          const {data} = action.payload;

          let attempts = data;
          state.attempts = attempts;
      },
    [getTest.fulfilled]: (state, action) => {
      const {tests} = action.payload;
      state.byId = _.merge(state.byId, tests);
    },
    [createTest.fulfilled]: (state, action) => {
      const {entities} = action.payload;
      state.byId = _.merge(state.byId, entities.tests);
    },
    [updateTest.fulfilled]: (state, action) => {
      const {entities} = action.payload;
      const data = action.meta.arg;
      let test = entities.tests[data.id]
      test = _.pick(test, _.keys(data))
      state.byId[data.id] = {...state.byId[data.id], ...test};
    },
      [deleteTest.fulfilled]:(state, action) => {
          const id = action.meta.arg;
          state.byId = _.omit(state.byId, id)
      },
      [publishTest.fulfilled]:(state, action) => {
          const id = action.meta.arg;
          state.byId = _.omit(state.byId, id)
      }

  }
})

export const testsActions = testsSlice.actions;
export default testsSlice.reducer;


export const selectTests = createSelector(
  (state) => state.test.tests.byId,
  (state, count) => count ? state.test.tests.all.ids.slice(-count) : state.test.tests.all.ids,
  (state) => state.test.mainQuestions.byId,
  (state) => state.test.sections.byId,
  (state) => state.test.questions.byId,
  (tests, ids, mainQuestions, sections, questions) => {
    // console.log(tests, ids)
    return denormalize(ids, [test], {tests, mainQuestions, sections, questions})
  }
)

export const selectEnrolledTests = createSelector(
  (state) => state.test.tests.byId,
  (state, count) => count ? state.test.tests.enrolled.ids.slice(-count) : state.test.tests.enrolled.ids,
  (state) => state.test.mainQuestions.byId,
  (state) => state.test.sections.byId,
  (state) => state.test.questions.byId,
  (tests, ids, mainQuestions, sections, questions) => {
    // console.log(tests, ids)
    return denormalize(ids, [test], {tests, mainQuestions, sections, questions})
  }
)

export const selectAttemptedTests = createSelector(
  (state) => state.test.tests.byId,
  (state, count) => count ? state.test.tests.attempted.ids.slice(-count) : state.test.tests.attempted.ids,
  (state) => state.test.mainQuestions.byId,
  (state) => state.test.sections.byId,
  (state) => state.test.questions.byId,
  (tests, ids, mainQuestions, sections, questions) => {
    // console.log(tests, ids)
    return denormalize(ids, [test], {tests, mainQuestions, sections, questions})
  }
)

export const selectAttempts = createSelector(
    (state) => state.test.tests.attempts.data,

    (attempts) => {
        return attempts;
    }
)

export const selectTest = createSelector(
  (state) => state.test.tests.byId,
  (state, id) => id,
  (state) => state.test.mainQuestions.byId,
  (state) => state.test.sections.byId,
  (state) => state.test.questions.byId,
  (tests, id, mainQuestions, sections, questions) => {
    return denormalize(id, test, {tests, mainQuestions, sections, questions})
  }
)

