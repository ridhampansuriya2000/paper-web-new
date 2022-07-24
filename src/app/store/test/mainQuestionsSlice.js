import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTest, getTests} from "./testsSlice";
import _ from "lodash";
import axios from "axios";
import {normalize} from "normalizr";
import {mainQuestion} from "../../api/schemas";
import {showMessage} from "../fuse/messageSlice";

const initialState = {
  byId: {},
}

export const createMainQuestion = createAsyncThunk(
  'test/mainQuestions/createMainQuestion',
  (data, thunkAPI) => axios.post('main-questions/', data)
    .then(({data}) => {

      // show message
      thunkAPI.dispatch(showMessage({
        message: 'Question created!',
        variant: 'success'
      }))


      thunkAPI.dispatch({
        type: "test/tests/onMainQuestionAdd",
        payload: data
      })
      return thunkAPI.fulfillWithValue(normalize(data, mainQuestion))
    }).catch(err=>{
      // show message
      thunkAPI.dispatch(showMessage({
        message:err?.response?.data?.message??'Question create error',
        variant:'error'
      }))
      throw Error
    })
)

export const updateMainQuestion = createAsyncThunk(
  'test/mainQuestions/updateMainQuestion',
  (data, thunkAPI) => axios.patch(`main-questions/${data.id}/`, data)
    .then(({data}) => {
      // show message
      thunkAPI.dispatch(showMessage({
        message: 'Question updated!',
        variant: 'success'
      }))
      return thunkAPI.fulfillWithValue(normalize(data, mainQuestion))
    }).catch(err=>{
      // show message
      thunkAPI.dispatch(showMessage({
        message:err?.response?.data?.message??'Question update error',
        variant:'error'
      }))
      throw Error
    })
)

export const deleteMainQuestion = createAsyncThunk(
  'test/mainQuestions/deleteMainQuestion',
  (id, thunkAPI) => axios.delete(`main-questions/${id}/`)
    .then(res=>{
      // show message
      thunkAPI.dispatch(showMessage({
        message: 'Question deleted!',
        variant: 'success'
      }))
    }).catch(err=>{
      // show message
      thunkAPI.dispatch(showMessage({
        message:err?.response?.data?.message??'Question delete error',
        variant:'error'
      }))
      throw Error
    })
)

const mainQuestionsSlice = createSlice({
  name: 'test/mainQuestions',
  initialState,
  reducers: {
    onSectionAdd: (state, action) => {
      const {id, main_question} = action.payload
      state.byId[main_question].sections = _.union(state.byId[main_question].sections, [id])
    }

  },
  extraReducers: {
    [getTest.fulfilled]: (state, action) => {
      const {mainQuestions} = action.payload;

      state.byId = _.merge(state.byId, mainQuestions)
    },
    [createMainQuestion.fulfilled]: (state, action) => {
      const {entities, result} = action.payload
      state.byId = _.merge(state.byId, entities.mainQuestions)
    },
    [updateMainQuestion.fulfilled]: (state, action) => {
      const {entities, result} = action.payload
      state.byId = _.merge(state.byId, entities.mainQuestions)
    },
    [deleteMainQuestion.fulfilled]: (state, action) => {
      const id = action.meta.arg;
      state.byId = _.omit(state.byId, id)
    }
  }
})

export default mainQuestionsSlice.reducer;