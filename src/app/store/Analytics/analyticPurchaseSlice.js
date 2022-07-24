import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";


export const getPurchaseValues = createAsyncThunk(
    'analytic/purchase',
    ({url = null, params}, thunkAPI) => axios.get(`analytic/purchase/`)
        .then(({data}) => {
            console.log(data)
            return thunkAPI.fulfillWithValue(data);
        })
)

const initialState = {
    data : []
}

 const analyticpurchase = createSlice({
    name: 'analyticpurchase',
    initialState,
    extraReducers: {
        [getPurchaseValues.fulfilled]: (state, action) => {
            console.log("payload", action.payload)
            const {data} = action.payload;
            state.data = data;
        }
    }
})


export default analyticpurchase.reducer;


export const selectanalyticpurchase = createSelector(
    (state) => state.analyticsResult.analyticpurchase.data,
    (data) => ({data})
)
