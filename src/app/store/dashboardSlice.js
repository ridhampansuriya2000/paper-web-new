import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {dashboard} from "../api/schemas";
import _ from "lodash";


export const getChartValues = createAsyncThunk(
  'dashboard/chart',
  ({url = null, params}, thunkAPI) => axios.get(`teacher/dashboard/get/${  (params.startValue && params.endValue) ? '?' + 'start_date=' + params.startValue + '&end_date=' +  params.endValue : ''}`)
    .then(({data}) => {
      const {bar_chart, line_chart, monthly_new_stu, monthly_total_atp, user, mothly_total_rn,pie_chart, bar_min_max, line_min_max, pie_min_max} = data;
      // const normalized = normalize(results, [dashboard])  // normalized: entities, result
      return thunkAPI.fulfillWithValue({bar_chart, line_chart, monthly_new_stu, monthly_total_atp, user, mothly_total_rn, pie_chart, bar_min_max, line_min_max, pie_min_max});
    })
)


export const getChartValuesForStudent = createAsyncThunk(
    'dashboard/student-chart',
    ({url = null, params}, thunkAPI) => axios.get(`teacher/dashboard/get/student/${  (params.startValue && params.endValue) ? '?' + 'start_date=' + params.startValue + '&end_date=' +  params.endValue : ''}`)
        .then(({data}) => {
            const {user, mothly_total_expand, monthly_total_atp, monthly_totle_teacher_test_bought, pie_chart,line_chart} = data;
            // const normalized = normalize(results, [dashboard])  // normalized: entities, result
            return thunkAPI.fulfillWithValue({user, mothly_total_expand, monthly_total_atp, monthly_totle_teacher_test_bought, pie_chart,line_chart});
        })
)

const initialState = {
    bar_chart :'',
    monthly_new_stu :'',
    mothly_total_rn :'',
    user :'',
    monthly_total_atp :'',
    pie_chart : '',
    line_chart :'',
    mothly_total_expand : '',
    monthly_totle_teacher_test_bought : '',
    bar_min_max : '',
    line_min_max : '',
    pie_min_max :'',
}

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  extraReducers: {
      [getChartValues.fulfilled]: (state, action) => {
          const {url, params} = action.meta.arg;
          const {bar_chart, line_chart, monthly_new_stu, monthly_total_atp, user, mothly_total_rn, pie_chart,  bar_min_max, line_min_max, pie_min_max} = action.payload;

          state.bar_chart = bar_chart;
          state.line_chart = line_chart;
          state.pie_chart = pie_chart;
          state.monthly_new_stu = monthly_new_stu;
          state.monthly_total_atp = monthly_total_atp;
          state.user = user;
          state.mothly_total_rn = mothly_total_rn;
          state.bar_min_max = bar_min_max;
          state.line_min_max = line_min_max;
          state.pie_min_max = pie_min_max;
      },
      [getChartValuesForStudent.fulfilled]: (state, action) => {
          const {url, params} = action.meta.arg;
          const {user, mothly_total_expand, monthly_total_atp, monthly_totle_teacher_test_bought, pie_chart,line_chart} = action.payload;

          state.user = user;
          state.mothly_total_expand = mothly_total_expand;
          state.monthly_total_atp = monthly_total_atp;
          state.monthly_totle_teacher_test_bought = monthly_totle_teacher_test_bought;
          state.pie_chart = pie_chart;
          state.line_chart = line_chart;
      }
  }
  })


export default chartsSlice.reducer;


/*
*
* Feature
* - ABORT TEST => Just delete all the answers of attempted tests.
* - VIEW RESULT => Display the marks in front of each question + Total Marks
* - GROUP ENROLLED TESTS ✅
* - DASHBOARD [5 EXPLORE TESTS + 5 ATTEMPTED TESTS ✅ + 5 ENROLLED TESTS ✅]
* - FIXED POINTS WHILE ATTEMPT
* - EXPLORE TEST FILTERS [Sort by - Price, filter by course, filter by teacher]
*
* */




export const selectCharts = createSelector(
    (state) => state.charts.bar_chart,
    (state) => state.charts.line_chart,
    (state) => state.charts.pie_chart,
    (state) => state.charts.monthly_new_stu,
    (state) => state.charts.monthly_total_atp,
    (state) => state.charts.user,
    (state) => state.charts.mothly_total_rn,
    (state) => state.charts.monthly_totle_teacher_test_bought,
    (state) => state.charts.mothly_total_expand,
    (state) => state.charts.bar_min_max,
    (state) => state.charts.line_min_max,
    (state) => state.charts.pie_min_max,
    (bar_chart,line_chart,pie_chart,monthly_new_stu,monthly_total_atp,userData,mothly_total_rn,monthly_totle_teacher_test_bought,mothly_total_expand,  bar_min_max, line_min_max, pie_min_max) =>
        ({bar_chart,line_chart,pie_chart,monthly_new_stu,monthly_total_atp,userData,mothly_total_rn,monthly_totle_teacher_test_bought,mothly_total_expand,  bar_min_max, line_min_max, pie_min_max})
)
