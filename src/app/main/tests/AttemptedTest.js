import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {Box, Chip, Grid, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getTests,
    selectAttemptedTests,
    getAttemptedTests,
    selectEnrolledTests,
    selectTests,
    getAttempts,
    selectAttempts
} from "../../store/test/testsSlice";
import axios from "axios";
import {showMessage} from "../../store/fuse/messageSlice";
import TestCard  from "./components/TestCard";

const Tests = () => {
  const dispatch = useDispatch();
  const testId = useParams();

  const tests = useSelector(selectAttemptedTests)
  const attempts = useSelector(selectAttempts)

  const {params, count, next} = useSelector(({test}) => test.tests.attempted)
  const [search, setSearch] = useState("")

  useEffect(() => {
      fetchAttempts()
  }, [search])

  const fetchAttempts = () => {
    dispatch(getAttempts({params: {...testId}, type: 'attempted'}))
  }


  return <FusePageSimple

    header={
      <Box className='flex items-center p-24 justify-between w-full border-b-1'>
        <Typography
          component={motion.span}
          initial={{x: -20, opacity:0}}
          animate={{x: 0,opacity:1}}
          className='hidden sm:flex text-20 mx-12'
        >
          Attempted Tests
        </Typography>
        <div className='flex-1'>

        </div>



      </Box>
    }
    content={
      <Box className='p-24'>
        <Grid container spacing={2}>
          {attempts.map((attempt,index) => (
            <Grid item xs={3} spacing={2}>
              <TestCard test={attempt} index={index} type="ATTEMPTED_LIST" buttonLabel='See Attempted Test Result'/>
            </Grid>
          ))}
        </Grid>
      </Box>
    }
    sidebarInner

  />
}

export default Tests;