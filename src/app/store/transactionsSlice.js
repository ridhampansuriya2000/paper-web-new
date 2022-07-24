import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {transaction} from "../api/schemas";
import _ from "lodash";

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  ({url, params}, thunkAPI) => axios.get(url || 'transactions/', {params: url ? null : params})
    .then(({data}) => {
      const {results, next} = data;
      const normalized = normalize(results, [transaction]);
      return thunkAPI.fulfillWithValue({...normalized, next})
    })
)

const initialState = {
  byId: {},
  all: {
    ids: [],
    next:null,
    params: {ordering: '-id', limit: 100}
  }
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  extraReducers: {
    [getTransactions.fulfilled]: (state, action) => {
      const {entities, result, next} = action.payload;
      const {url, params} = action.meta.arg;
      state.byId = _.merge(state.byId, entities.transactions);
      state.all = {ids: url ? _.union(state.all.ids, result) : result, next, params}
    }
  }
})

export default transactionsSlice.reducer;


export const selectTransactions = createSelector(
  (state) => state.transactions.byId,
  (state) => state.transactions.all.ids,
  (transactions, ids) => denormalize(ids, [transaction], {transactions})
)