import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


export const getAttemptResultValues = createAsyncThunk(
    'analytics/attemptResult',
    ({url = null, params}, thunkAPI) => axios.get(`getattempted/result/`)
        .then(({data}) => {
            return thunkAPI.fulfillWithValue(data);
        })
)

const initialState = {
    data : []
}

 const attemptResult = createSlice({
    name: 'analyticsResult',
    initialState,
    extraReducers: {
        [getAttemptResultValues.fulfilled]: (state, action) => {
            const {data} = action.payload;
            state.data = data;
        }
    }
})


export default attemptResult.reducer;


export const selectAttemptResult = createSelector(
    (state) => state.analyticsResult.attemtResult.data,
    (data) => ({data})
)
