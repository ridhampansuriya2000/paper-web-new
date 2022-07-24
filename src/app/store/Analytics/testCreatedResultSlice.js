import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";


export const getTestCreatedResultValues = createAsyncThunk(
    'analytics/getCreatedResult',
    ({url = null, params}, thunkAPI) => axios.get(`gettestcreate/result/`)
        .then(({data}) => {
            console.log(data)
            return thunkAPI.fulfillWithValue(data);
        })
)

const initialState = {
    data : []
}

 const testCreatedResult = createSlice({
    name: 'testCreatedResult',
    initialState,
    extraReducers: {
        [getTestCreatedResultValues.fulfilled]: (state, action) => {
            console.log("payload", action.payload)
            const {data} = action.payload;
            state.data = data;
        }
    }
})


export default testCreatedResult.reducer;


export const selectTestCreatedResult = createSelector(
    (state) => state.analyticsResult.testCreatedResult.data,
    (data) => ({data})
)
