import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {Box, Chip, Grid, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getAttemptsList,
    selectAttemtedList,
} from "../../store/AttemptedTests/attemtedTestsSlice";

import TestCard  from "./components/TestCard";

const AttemptedList = () => {
  const dispatch = useDispatch();
  const testId = useParams();
  const studentId = useParams();

  const attemtedList = useSelector(selectAttemtedList);
  const [search, setSearch] = useState("")

  useEffect(() => {
      testId && studentId && fetchAttempts()
  }, [search,testId])

  const fetchAttempts = () => {
      testId &&  dispatch(getAttemptsList(testId,studentId))
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
          Students
        </Typography>
        <div className='flex-1'>
        </div>
      </Box>
    }
    content={
      <Box className='p-24'>
        <Grid container spacing={2}>
          {attemtedList.map((attempt,index) => (
            <Grid item xs={3} spacing={2}>
              <TestCard test={{...attempt, studentId : studentId.studentId}} index={index} type="ATTEMPTED_TEST_LIST" buttonLabel='See Result'/>
            </Grid>
          ))}
        </Grid>
      </Box>
    }
    sidebarInner

  />
}

export default AttemptedList;