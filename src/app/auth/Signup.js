import {motion} from 'framer-motion';
import {Controller, useForm} from 'react-hook-form';

import {yupResolver} from '@hookform/resolvers/yup';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import {PASSWORD_REGEX} from '../api/constants';
import {
    Box,
    CardContent,
    LinearProgress,
    MenuItem, styled,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {login, register, verifyOTP} from "./store/userSlice";
import MediaQuery from "react-responsive";
import {Grid, Stack} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

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

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 13,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#556ee6',
    borderRadius: '4px',
    height: '35px',
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
    '&:disabled': {
        border: 'none',
    },
});

const Signup = () => {
    const dispatch = useDispatch();


    const {control, formState, handleSubmit, reset} = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const {isValid, dirtyFields, errors} = formState;

    const [otp, setOtp] = useState('');
    const [otpSentMobile, setOtpSentMobile] = useState('');


    const [progress, setProgress] = useState(false)
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [accountType, setAccountType] = useState('');

    const matches = useMediaQuery('(min-width:430px)');

    const isValidate = () => {
        if (mobile && name && accountType) {
            return true;
        }
    }


    const handleVerifyOTP = () => {
        setProgress(true)
        dispatch(verifyOTP({mobile: otpSentMobile, otp}))
            .unwrap()
            .then(() => {
                setProgress(false)
            }).catch(err => {
            setProgress(false)
        })
    }


    function onSubmit() {
        let obj = {
            name: name,
            mobile: mobile,
            type: accountType
        }
        // reset(defaultValues);
        setProgress(true)
        dispatch(register(obj))
            .unwrap()
            .then(() => {
                setProgress(false)
                setOtpSentMobile(obj.mobile)
            }).catch(() => {
            setProgress(false)
        })
    }

    return (



            <Box sx={{backgroundColor: 'rgb(248, 248, 251)', height: '100vh'}}>
                <div className='w-100 d-flex align-items-center flex-row h-100' style={{justifyContent: 'space-evenly'}}>

                    <Grid container sx={{display:'flex',justifyContent:'center',flexDirection:'row'}}>
                        <Grid xs={11} >

                            <Stack className='w-100 d-flex  align-items-center flex-row h-100' sx={matches ? {minWidth:'400px',justifyContent: 'space-evenly'} :{justifyContent: 'space-evenly'}}>
                                <MediaQuery minWidth={1224}>
                                    <img
                                        width={300}
                                        height={300}
                                        src='Images/Icons/LoginIcon.svg'
                                        style={{paddingBottom:'65px'}}
                                    />
                                </MediaQuery>
                                <Stack sx={matches && {minWidth:'400px'}}>
                                    <Stack className='flex flex-column' sx={{borderRadius: '4px'}}>
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
                                            <Box sx={{color: '#556ee6', fontSize: '16px', fontWeight: '600'}}>
                                                <p>Sign up now!</p>
                                                <p style={{fontSize: '15px'}}>Start using Paper</p>
                                            </Box>
                                        </CardContent>
                                        <CardContent className="flex flex-col items-center justify-center"
                                                     sx={{
                                                         backgroundColor: '#ffffff',
                                                         width: '100%',
                                                         maxWidth: '390px',
                                                         padding: `${matches  ? '30px 45px' : '30px 30px'} `,
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
                                                        htmlFor='name'>
                                                        Enter Your Name
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
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        style={{
                                                            fontFamily: 'Poppins',
                                                            fontWeight: '500',
                                                            color: 'rgb(73, 80, 87)'
                                                        }}
                                                    />
                                                </div>

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
                                                        onChange={e => {
                                                            let {value} = e.target;
                                                            value = value.replace(/[a-zA-Z]/g, "");
                                                            value = value.replace(/[&\/\\#\-,+()$`|~%.;=[\]!@^_'":*?<>{}]/g, '');
                                                            setMobile(value);
                                                        }}
                                                        style={{
                                                            fontFamily: 'Poppins',
                                                            fontWeight: '500',
                                                            color: 'rgb(73, 80, 87)'
                                                        }}
                                                    />
                                                </div>

                                                <div style={{
                                                    // fontFamily: 'Poppins',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: 'rgb(73, 80, 87)',
                                                    lineHeight: '1',
                                                }}>
                                                    <label
                                                        htmlFor='mobileNo'>
                                                        Select Account Type
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
                                                    <select id="mobileNo"
                                                            name="cars"
                                                            value={accountType}
                                                            onChange={(e) => setAccountType(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0px 10px',
                                                                fontFamily: 'Poppins',
                                                                fontWeight: '500',
                                                                color: 'rgb(73, 80, 87)'
                                                            }}
                                                    >
                                                        <option value='' disabled>Select Account</option>
                                                        <option value='STUDENT'>Student</option>
                                                        <option value='TEACHER'>Teacher</option>
                                                    </select>
                                                </div>

                                                {otpSentMobile !== "" && (
                                                    <>
                                                        <div style={{
                                                            // fontFamily: 'Poppins',
                                                            fontSize: '13px',
                                                            fontWeight: '500',
                                                            color: 'rgb(73, 80, 87)',
                                                            lineHeight: '1',
                                                        }}>
                                                            <label
                                                                htmlFor='mobileNo'>
                                                                Please enter OTP sent on mobile {otpSentMobile} to complete registration.
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
                                                                value={otp}
                                                                onChange={e => {
                                                                    let {value} = e.target;
                                                                    value = value.replace(/[a-zA-Z]/g, "");
                                                                    value = value.replace(/[&\/\\#\-,+()$`|~%.;=[\]!@^_'":*?<>{}]/g, '');
                                                                    setOtp(value);
                                                                }}
                                                                style={{
                                                                    fontFamily: 'Poppins',
                                                                    fontWeight: '500',
                                                                    color: 'rgb(73, 80, 87)'
                                                                }}
                                                            />
                                                        </div>

                                                        <BootstrapButton
                                                            variant={"contained"}
                                                            onClick={handleVerifyOTP}
                                                            disabled={!isValidate() || !otp}
                                                        >Verify OTP</BootstrapButton>
                                                    </>
                                                )}

                                                {((mobile === '') || (mobile !== otpSentMobile)) &&
                                                <BootstrapButton
                                                    variant={"contained"}
                                                    onClick={onSubmit}
                                                    disabled={!isValidate()}
                                                >Create an Account</BootstrapButton>}

                                            </div>


                                        </CardContent>
                                    </Stack>
                                    <div className="flex flex-row items-center justify-center  pt-32 pb-24"
                                         style={{fontSize: '15px', gap: '3px'}}>
                                        <span className="font-normal">Already have an account?</span>
                                        <Link className="font-normal" to="/login">
                                            Sign In
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
};

export default Signup;