import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";


export const getTriesValues = createAsyncThunk(
    'analytics/tries',
    ({url = null, params}, thunkAPI) => axios.get(`student/analytics/tries/`)
        .then(({data}) => {
            return thunkAPI.fulfillWithValue(data);
        })
)

const initialState = {
    data : []
}

 const tries = createSlice({
    name: 'tries',
    initialState,
    extraReducers: {
        [getTriesValues.fulfilled]: (state, action) => {
            console.log("payload", action.payload)
            const {data} = action.payload;
            state.data = data;
        }
    }
})


export default tries.reducer;


export const selecttries = createSelector(
    (state) => state.analyticsResult.tries.data,
    (data) => ({data})
)
