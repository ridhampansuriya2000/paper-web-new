import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


export const getCourseList = createAsyncThunk(
  'test/getCourseList',
  (_,thunkAPI) => axios.get( 'courses/' )
    .then(({data}) => {
      const { results} = data;
      return thunkAPI.fulfillWithValue({results});
    })
)

export const getTeachersList = createAsyncThunk(
  'test/getTeachersList',
  (_,thunkAPI) => axios.get(`teachers/`)
    .then(({data}) => {
        const { results} = data;
        return thunkAPI.fulfillWithValue({results});
    })
)

const initialState = {
    courseList:[],
    teacherList:[],
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  extraReducers: {
    [getCourseList.fulfilled]: (state, action) => {
        state.courseList = action.payload.results
    },
    [getTeachersList.fulfilled]: (state, action) => {
        state.teacherList = action.payload.results
    }
  }
})


export default filterSlice.reducer;

export const selectFilter = createSelector(
    (state) => state.filter.teacherList,
    (state) => state.filter.courseList,
    (teacherList, courseList) => ({teacherList, courseList})
)


