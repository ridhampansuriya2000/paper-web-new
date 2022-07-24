/* eslint import/no-extraneous-dependencies: off */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import {setInitialSettings} from 'app/store/fuse/settingsSlice';
import {showMessage} from 'app/store/fuse/messageSlice';
import jwtService from 'app/services/jwtService';
import {API_BASE_URL} from '../../api/constants';
import axios from 'axios';
import {createSelector} from 'reselect'


export const login = createAsyncThunk(
  'auth/user/login',
  ({mobile}, thunkAPI) => axios.post('auth/login/', {mobile})
    .then(res => {
      thunkAPI.dispatch(showMessage({
        message: res.data?.message ?? "OTP Sent on mobile " + mobile + ". Please verify for login.",
        variant: 'success'
      }))
      return thunkAPI.fulfillWithValue()
    }).catch(err => {
      thunkAPI.dispatch(showMessage({
        message: err.response?.data?.message ?? "OTP Sending Failed, please check the mobile if registered.",
        variant: 'error'
      }))
      return thunkAPI.rejectWithValue()
    })
)
export const register = createAsyncThunk(
  'auth/user/register',
  ({mobile, name, type}, thunkAPI) => axios.post('auth/register/', {mobile, name, type})
    .then(res => {
      thunkAPI.dispatch(showMessage({
        message: res.data?.message ?? "Please verify OTP to complete registration",
        variant: 'success'
      }))
      return thunkAPI.fulfillWithValue()
    }).catch(err => {
      thunkAPI.dispatch(showMessage({
        message: err.response?.data?.message ?? "OTP Sending Failed, please check the mobile if already registered.",
        variant: 'error'
      }))
      return thunkAPI.rejectWithValue()
    })
)

export const verifyOTP = createAsyncThunk(
  'auth/user/verifyOTP',
  ({mobile, otp}, thunkAPI) => axios.post('auth/verify-otp/', {mobile, otp})
    .then(res => {
      const user = {...res.data.user, role: res.data.user.type}
      thunkAPI.dispatch(setUser(user))
      jwtService.setSession(res.data.token)
      return thunkAPI.fulfillWithValue()
    }).catch(err => {
      thunkAPI.dispatch(showMessage({
        message: err.response?.data?.message ?? "OTP Verification failed",
        variant: 'error'
      }))
      return thunkAPI.rejectWithValue()
    })
)


export const setUserData = (user) => async (dispatch, getState) => {
  history.location.state = {
    redirectUrl: user.redirectUrl,
  };

  // console.log('REDIRECT URL => ', user.redirectUrl)

  dispatch(setUser(user));
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, {data: {settings}});

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};


export const logoutUser = () => async (dispatch, getState) => {
  const {user} = getState().auth;

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: '/',
  });

  jwtService.logout();

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }
};

export const updateUser = createAsyncThunk(
  'auth/user/updateUser',
  ({name, email, gender, course, image, bank_details}, thunkAPI) => {
    const fd = new FormData();
    name && fd.append('name', name);
    email && fd.append('email', email);
    gender && fd.append('gender', gender);
    course && fd.append('course', course);
    image && fd.append('image', image);
    bank_details && fd.append('bank_details', bank_details);

    axios.post(API_BASE_URL + 'auth/update-account/', fd)
      .then(res => {
        const user = {...res.data.user, role: res.data.user.type}
        thunkAPI.dispatch(setUser(user))
        jwtService.setSession(res.data.token)
        return thunkAPI.dispatch(showMessage({
          message: 'Updated',
          variant: 'success',
        }));

      }).catch(err => {
      return thunkAPI.dispatch(showMessage({
        message: err.response?.data?.message,
        variant: 'error',
      }));
    });
  },
);


const initialState = {
  role: '',
};

const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const {setUser, userLoggedOut} = userSlice.actions;

export default userSlice.reducer;


export const selectAuthRole = createSelector(
  state => state.auth,
  (auth) => auth.user.role
)

export const selectIsTeacher = createSelector(
  selectAuthRole,
  (role) => role === 'TEACHER'
)