import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getTest, getTests} from "./testsSlice";
import _ from "lodash";
import axios from "axios";
import {normalize} from "normalizr";
import {section} from "../../api/schemas";
import {showMessage} from "../fuse/messageSlice";

const initialState = {
    byId: {},
}

export const createSection = createAsyncThunk(
    'test/sections/createSection',
    (data, thunkAPI) => axios.post('sections/', data)
        .then(({data})=>{

            // show message
            thunkAPI.dispatch(showMessage({
                message: 'Section created!',
                variant: 'success'
            }))

            thunkAPI.dispatch({
                type: "test/mainQuestions/onSectionAdd",
                payload: data
            })
            return thunkAPI.fulfillWithValue(normalize(data, section))
        }).catch(err=>{
        // show message
        thunkAPI.dispatch(showMessage({
          message:err?.response?.data?.message??'Answer Part create error',
          variant:'error'
        }))
        throw Error

      })
)

export const deleteSection = createAsyncThunk(
    'test/sections/deleteSection',
    (id, thunkAPI) => axios.delete(`sections/${id}/`)
      .then(()=>{
          // show message
          thunkAPI.dispatch(showMessage({
              message: 'Section deleted!',
              variant: 'success'
          }))
      }).catch(err=>{
        // show message
        thunkAPI.dispatch(showMessage({
          message:err?.response?.data?.message??'Answer Part delete error',
          variant:'error'
        }))
        throw Error

      })
)

const sectionsSlice = createSlice({
    name: 'test/sections',
    initialState,
    reducers:{
        onQuestionCreate:(state, action)=>{
            const {id, section} = action.payload
            state.byId[section].questions = _.union(state.byId[section].questions, [id])
        }

    },
    extraReducers: {
        [getTest.fulfilled]: (state, action) => {
            const {sections} = action.payload;
            state.byId = _.merge(state.byId, sections)
        },
        [createSection.fulfilled]: (state, action) => {
            const {entities} = action.payload;
            state.byId = _.merge(state.byId, entities.sections)
        },
        [deleteSection.fulfilled]:(state, action) => {
            const id = action.meta.arg;
            state.byId = _.omit(state.byId, id)
        }
    }
})

export default sectionsSlice.reducer;