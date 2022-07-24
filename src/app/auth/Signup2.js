import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import React, {useState} from 'react';
import { PASSWORD_REGEX } from '../api/constants';
import {
  CardContent,
  LinearProgress,
  MenuItem,
  TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {register, verifyOTP} from "./store/userSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter your name'),
  mobile: yup.string().required('You must enter mobile').matches(/^\d{10}$/, "Please enter a valid mobile"),
});

const defaultValues = {
  name: '',
  mobile: '',
  type: 'TEACHER',
};

const Signup = () => {
  const dispatch = useDispatch();


  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const [otp, setOtp] = useState('');
  const [otpSentMobile, setOtpSentMobile] = useState('');


  const [progress, setProgress] = useState(false)


  const handleVerifyOTP = () => {
    setProgress(true)
    dispatch(verifyOTP({mobile:otpSentMobile, otp}))
        .unwrap()
        .then(()=> {
          setProgress(false)
        }).catch(err=>{
      setProgress(false)
    })
  }



  function onSubmit(data) {
    // reset(defaultValues);
    setProgress(true)
    dispatch(register(data))
        .unwrap()
        .then(()=>{
          setProgress(false)
          setOtpSentMobile(data.mobile)
        }).catch(()=>{
          setProgress(false)
    })
  }

  return (
    <div
      className={clsx(
        'flex flex-col flex-auto p-16 sm:p-24 md:flex-row md:p-0 overflow-hidden',
      )}
    >
      <div className="flex flex-col flex-grow-0 items-center p-16 text-center md:p-64 md:flex-shrink-0 md:flex-1">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 , transition: { delay: 0.3 } }}
        >

          {/*<img src='Secure login.gif' className=''/>*/}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <Typography className="text-32 sm:text-32 font-semibold leading-tight">
            Let's Try Paper
          </Typography>
        </motion.div>
      </div>

      <Card
        component={motion.div}
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ bounceDamping: 0 }}
        className='w-full max-w-400 mx-auto m-16 md:m-0 rounded-20 md:rounded-none'
        square
        layout
      >
        {progress === 'registering' && <LinearProgress/>}
        <CardContent className='flex flex-col items-center justify-center p-16 sm:p-32 md:p-48 md:pt-128 '>
          <Typography variant='h6' className='mb-24 font-semibold text-18 sm:text-24'>
            Register
          </Typography>

          {otpSentMobile === "" && (
              <form
            name='registerForm'
            noValidate
            className='flex flex-col justify-center w-full'
            onSubmit={handleSubmit(onSubmit)}
            hidden={otpSentMobile !== ''}
          >
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-16'
                  label='Name'
                  autoFocus
                  type='name'
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant='outlined'
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name='mobile'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-16'
                  label='Mobile'
                  type='mobile'
                  error={!!errors.mobile}
                  helperText={errors?.mobile?.message}
                  variant='outlined'
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-16'
                  label='Select Account Type'
                  type='type'
                  error={!!errors.type}
                  helperText={errors?.type?.message}
                  variant='outlined'
                  required
                  fullWidth
                  select
                >
                  <MenuItem value='STUDENT'>Student</MenuItem>
                  <MenuItem value='TEACHER'>Teacher</MenuItem>
                </TextField>
              )}
            />



            <Button
              variant='contained'
              color='primary'
              className='w-full mx-auto mt-16'
              aria-label='Register'
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type='submit'
              onClick={()=>onSubmit()}
            >
              Create an account
            </Button>
          </form>
          )}

          {otpSentMobile !== "" && (
              <div
                  className='flex flex-col justify-center w-full space-y-12'
              >
                <Typography>Please enter OTP sent on mobile {otpSentMobile} to complete registration.</Typography>
                <TextField
                    label='Enter OTP'
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                />
                <Button variant={"contained"} onClick={handleVerifyOTP}>Verify OTP</Button>

              </div>

          )}


          <div className='flex flex-col items-center justify-center pt-32 pb-24'>
            <span className='font-normal'>Already have an account?</span>
            <Link className='font-normal' to='/login'>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;