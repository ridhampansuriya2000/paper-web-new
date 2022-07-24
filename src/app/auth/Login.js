import {motion} from 'framer-motion';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import {CardContent, LinearProgress, TextField, OutlinedInput, FormControl, Box} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {login, verifyOTP} from "./store/userSlice";
import MediaQuery from 'react-responsive'
import {Grid, Stack} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 13,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#556ee6',
    borderRadius: '4px',
    height : '35px',
    borderColor: '#0063cc',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
});

const Login = () => {
    const dispatch = useDispatch()

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSentMobile, setOtpSentMobile] = useState('');
    const [progress, setProgress] = useState(false);

    const matches = useMediaQuery('(min-width:430px)');

    const handleSendOTP = () => {
        setProgress(true)
        dispatch(login({mobile}))
            .unwrap()
            .then(()=> {
                setProgress(false);
                setOtpSentMobile(mobile)
            }).catch(err=>{
                setProgress(false)
        })

    }

    const handleVerifyOTP = () => {
        setProgress(true)
        dispatch(verifyOTP({mobile, otp}))
            .unwrap()
            .then(()=> {
                setProgress(false)
            }).catch(err=>{
            setProgress(false)
        })
    }

    return (
        <Box sx={{backgroundColor: 'rgb(248, 248, 251)', height: '100vh'}}>
            <div className='w-100 d-flex align-items-center flex-row h-100' style={{justifyContent: 'space-evenly'}}>

                <Grid container sx={{display:'flex',justifyContent:'center',flexDirection:'row'}}>
                <Grid xs={11} >

               <Stack sx={{display:'flex',flexDirection:'row', justifyContent:'space-evenly'}}>
                   <MediaQuery minWidth={1224}>
                       <img
                           width={300}
                           height={300}
                           src='Images/Icons/LoginIcon.svg'
                           style={{paddingBottom:'65px'}}
                       />
                   </MediaQuery>
                   <Stack sx={matches && {minWidth:'400px'}}>
                       <Stack className='flex flex-column' sx={{borderRadius: '4px', alignItems:'center'}}>
                           <CardContent sx={{
                               boxSizing: 'border-box',
                               zIndex: '24',
                               width: '100%',
                               maxWidth: '390px',
                               backgroundColor: 'rgb(214, 218, 247)',
                               borderRadius: '4px 4px 0px 0px',
                               height: '110px',
                               display: 'flex',
                               alignItems: 'center',
                               padding: `${matches  ? '0px 45px' : '0px 30px'} `,
                           }}>
                               <Box sx={{color: '#556ee6', fontSize: '16px', fontWeight: '600', display: 'flex'}}>
                          <span>
                              <p>Let's try Paper</p>
                          <p style={{fontSize: '20px'}}>Log in to start using Paper</p>
                          </span>

                               </Box>
                           </CardContent>
                           <CardContent className="flex flex-col items-center justify-center"
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            maxWidth: '390px',
                                            padding: `${matches  ? '30px 45px' : '30px 30px'} `,
                                            width: '100%',
                                        }}
                           >
                               <div
                                   className='flex flex-col justify-center w-full space-y-12'
                               >
                                   <div style={{
                                       // fontFamily: 'Poppins',
                                       fontSize: '13px',
                                       fontWeight: '500',
                                       color: 'rgb(73, 80, 87)',
                                       lineHeight: '1',
                                   }}>
                                       <label
                                           htmlFor='mobileNo'>
                                           Enter Mobile Number
                                       </label>
                                   </div>
                                   <div className='d-flex align-items-center justify-content-center'
                                        style={{
                                            border: '1px solid #808080b3',
                                            borderRadius: '4px',
                                            height: '35px',
                                            fontSize: '15px',
                                            maxWidth: '390px',
                                            marginTop: '0px',
                                        }}>
                                       <input
                                           type='text'
                                           className='w-100 mx-2'
                                           id='mobileNo'
                                           value={mobile}
                                           onChange={e => setMobile(e.target.value)}
                                           style={{
                                               fontFamily: 'Poppins',
                                               fontWeight: '500',
                                               color: 'rgb(73, 80, 87)'
                                           }}
                                       />
                                   </div>

                                   {((mobile !== '') && (mobile === otpSentMobile)) && (
                                       <>
                                           <div style={{
                                               // fontFamily: 'Poppins',
                                               fontSize: '13px',
                                               fontWeight: '500',
                                               color: 'rgb(73, 80, 87)',
                                               lineHeight: '1',
                                           }}>
                                               <label
                                                   htmlFor='otp'>
                                                   Otp
                                               </label>
                                           </div>
                                           <div className='d-flex align-items-center justify-content-center'
                                                style={{
                                                    border: '1px solid #808080b3',
                                                    borderRadius: '4px',
                                                    height: '35px',
                                                    fontSize: '15px',
                                                    maxWidth: '390px',
                                                    marginTop: '0px',
                                                }}>
                                               <input
                                                   type='text'
                                                   className='w-100 mx-2'
                                                   id='otp'
                                                   value={otp}
                                                   onChange={e => setOtp(e.target.value)}
                                                   style={{
                                                       fontFamily: 'Poppins',
                                                       fontWeight: '500',
                                                       color: 'rgb(73, 80, 87)'
                                                   }}
                                               />
                                           </div>
                                       </>
                                   )}

                                   {((mobile === '') || (mobile !== otpSentMobile)) &&
                                   <BootstrapButton variant={"contained"} onClick={handleSendOTP}>Send
                                       OTP</BootstrapButton>}
                                   {((mobile !== '') && (mobile === otpSentMobile)) &&
                                   <BootstrapButton variant={"contained"} onClick={handleVerifyOTP}>Verify
                                       OTP</BootstrapButton>}

                               </div>


                           </CardContent>
                       </Stack>
                       <div className="flex flex-row items-center justify-center  pt-32 pb-24" style={{fontSize: '15px',gap : '3px'}}>
                           <span className="font-normal">Don't have an account?</span>
                           <Link className="font-normal" to="/signup">
                               Sign Up
                           </Link>
                       </div>
                   </Stack>

                   <MediaQuery minWidth={1224}>
                       <div style={{width:'300px'}}>
                       </div>
                   </MediaQuery>

               </Stack>

                </Grid>
                </Grid>

            </div>
        </Box>
    );
}

export default Login;