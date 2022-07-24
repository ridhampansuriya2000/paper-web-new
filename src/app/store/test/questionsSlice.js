import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTest, getTests} from "./testsSlice";
import _ from "lodash";
import {normalize} from "normalizr";
import {question} from "../../api/schemas";
import axios from "axios";
import {showMessage} from "../fuse/messageSlice";

const initialState = {
    byId: {},
}

export const createQuestion = createAsyncThunk(
    'test/questions/onQuestionCreate',
    (data, thunkAPI) => axios.post('questions/', data)
        .then(({data}) => {

          // show message
          thunkAPI.dispatch(showMessage({
            message: 'Answer created!',
            variant: 'success'
          }))

            thunkAPI.dispatch({
                type: 'test/sections/onQuestionCreate',
                payload: data
            })
            return thunkAPI.fulfillWithValue(normalize(data, question))
        }).catch(err=>{
        // show message
        thunkAPI.dispatch(showMessage({
          message:err?.response?.data?.message??'Answer create error',
          variant:'error'
        }))

        throw Error

      })
)


export const deleteQuestion = createAsyncThunk(
    'test/questions/deleteQuestion',
    (id, thunkAPI) => axios.delete(`questions/${id}/`)
      .then(res=>{
        // show message
        thunkAPI.dispatch(showMessage({
          message: 'Answer deleted!',
          variant: 'success'
        }))
      }).catch(err=>{
        // show message
        thunkAPI.dispatch(showMessage({
          message:err?.response?.data?.message??'Answer delete error',
          variant:'error'
        }))

        throw Error

      })
)

export const updateQuestion = createAsyncThunk(
    'test/questions/updateQuestion',
    (data, thunkAPI) => axios.patch(`questions/${data.id}/`, data)
        .then(({data}) => {

          // show message
          thunkAPI.dispatch(showMessage({
            message: 'Updated!',
            variant: 'success'
          }))

            return thunkAPI.fulfillWithValue(normalize(data, question))
        }).catch(err=>{
        // show message
        thunkAPI.dispatch(showMessage({
          message:err?.response?.data?.message??'Answer update error',
          variant:'error'
        }))
        throw Error
      })
)


const questionsSlice = createSlice({
    name: 'test/questions',
    initialState,
    extraReducers: {
        [getTest.fulfilled]: (state, action) => {
            const {questions} = action.payload;
            state.byId = _.merge(state.byId, questions)
        },
        [createQuestion.fulfilled]: (state, action) => {
            const {entities} = action.payload;
            state.byId = _.merge(state.byId, entities.questions)
        },
        [updateQuestion.fulfilled]: (state, action) => {
            const {entities} = action.payload;
            state.byId = _.merge(state.byId, entities.questions)
        },
        [deleteQuestion.fulfilled]: (state, action) => {
            const id = action.meta.arg;
            state.byId = _.omit(state.byId, id)
        }

    }
})

export default questionsSlice.reducer;