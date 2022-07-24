import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {course} from "../api/schemas";

export const getCourses = createAsyncThunk(
    'courses/getCourses',
    (_, thunkAPI) => axios.get('courses/')
        .then(({data}) => {
            const {results} = data;
            const {result, entities} = normalize(results, [course])
            return thunkAPI.fulfillWithValue({ids: result, ...entities})
        })
)

export const getLanguage = createAsyncThunk(
    'language/getLanguage',
    (_, thunkAPI) => axios.get('getlanguage/')
        .then((res) => {
            const {data} = res;
            return thunkAPI.fulfillWithValue(data)
        })
)

export const getDifficulty = createAsyncThunk(
    'difficulty/getDifficulty',
    (_, thunkAPI) => axios.get('getdifficulty/')
        .then((res) => {
            const {data} = res;
            return thunkAPI.fulfillWithValue(data)
        })
)

export const getTestDetails = createAsyncThunk(
    'courses/getTestDetails',
    ({id}, thunkAPI) => axios.get(`tests/analytic/${id}/`)
        .then(({data}) => {
            return thunkAPI.fulfillWithValue({testDetails: data.data})
        })
)

const initialState = {
    byId: {},
    all: {
        ids: []
    },
    testDetails : {},
    languages : [],
    difficulty : [],
}

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    extraReducers: {
        [getCourses.fulfilled]: (state, action) => {
            const {ids, courses} = action.payload;
            state.byId = courses;
            state.all.ids = ids;
        },
        [getLanguage.fulfilled]: (state, action) => {
            const {data} = action.payload;
            state.languages = data;
        },
        [getDifficulty.fulfilled]: (state, action) => {
            const {data} = action.payload;
            state.difficulty = data;
        },
        [getTestDetails.fulfilled]: (state, action) => {
            const {testDetails} = action.payload;
            state.testDetails = testDetails;
        }
    }
})

export default coursesSlice.reducer;


export const selectCourses = createSelector(
    ({courses}) => courses.byId,
    ({courses}) => courses.all?.ids??[],
    (courses, ids) => denormalize(ids, [course], {courses})
)

export const selectTestDetails = createSelector(
    ({courses}) => courses.testDetails,
    (testDetails) => (testDetails)
)

export const selectLanguageList = createSelector(
    (state) => state.courses.languages,
    (languages) => (languages)
)

export const selectDificultyList = createSelector(
    (state) => state.courses.difficulty,
    (difficulty) => (difficulty)
)

