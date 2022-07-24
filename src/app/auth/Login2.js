import {motion} from 'framer-motion';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import {CardContent, LinearProgress, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {login, verifyOTP} from "./store/userSlice";

const Login = () => {
    const dispatch = useDispatch()

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSentMobile, setOtpSentMobile] = useState('');
    const [progress, setProgress] = useState(false)

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
        <>
        <div
            className={clsx(
                'flex flex-col flex-auto p-16 sm:p-24 md:flex-row md:p-0 overflow-hidden login-bg-img'
            )}
        >

            <div className="flex flex-col flex-grow-0 items-center p-16 text-center md:p-64 md:flex-shrink-0">
                <motion.div
                    initial={{scale: 0.6, opacity: 0}}
                    animate={{scale: 1, opacity: 1, transition: {delay: 0.3}}}
                >

                    {/*<img src='Secure login.gif' className=''/>*/}
                </motion.div>

                <motion.div
                    initial={{opacity: 0, x: 40}}
                    animate={{opacity: 1, x: 0, transition: {delay: 0.3}}}
                >
                    <Typography className="text-32 sm:text-32 font-semibold leading-tight">
                        Let's Try Paper
                    </Typography>
                </motion.div>
            </div>

            <Card
                component={motion.div}
                initial={{x: 200}}
                animate={{x: 0}}
                transition={{bounceDamping: 0}}
                className="w-full max-w-400 mx-auto m-16 md:m-0 rounded-20 md:rounded-none"
                square
                layout
            >
                {progress && <LinearProgress/>}
                <CardContent className="flex flex-col items-center justify-center p-16 sm:p-32 md:p-48 md:pt-128 ">
                    <Typography variant="h6" className="mb-24 font-semibold text-18 sm:text-24">
                        Login to your account
                    </Typography>

                    <div
                        className='flex flex-col justify-center w-full space-y-12'
                    >
                        <TextField
                            label='Enter Mobile Number'
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                        />
                        {((mobile !== '') && (mobile === otpSentMobile)) && (
                            <TextField
                                label='Enter OTP'
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                        )}
                        {((mobile === '') || (mobile !== otpSentMobile)) &&
                        <Button variant={"contained"} onClick={handleSendOTP}>Send OTP</Button>}
                        {((mobile !== '') && (mobile === otpSentMobile)) &&
                        <Button variant={"contained"} onClick={handleVerifyOTP}>Verify OTP</Button>}

                    </div>

                    <div className="flex flex-col items-center justify-center pt-32 pb-24">
                        <span className="font-normal">Don't have an account?</span>
                        <Link className="font-normal" to="/signup">
                            Create an account
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
            </>
    );
}

export default Login;