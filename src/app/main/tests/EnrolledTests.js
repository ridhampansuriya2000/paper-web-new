import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {Box, Chip, Grid, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {getTests, selectEnrolledTests, selectTests} from "../../store/test/testsSlice";
import axios from "axios";
import {showMessage} from "../../store/fuse/messageSlice";
import TestCard from "./components/TestCard";
import _ from "lodash";

const Tests = () => {
  const dispatch = useDispatch();

  const tests = useSelector(selectEnrolledTests)

  const {params, count, next} = useSelector(({test}) => test.tests.enrolled)
  const [search, setSearch] = useState("")

  useEffect(async () => {
    await fetchTests();
  }, [search])

  const fetchTests = () => {
    dispatch(getTests({params: {...params, search}, type: 'enrolled'}))
  }


  return <FusePageSimple

    header={
      <Box className='flex items-center p-24 justify-between w-full border-b-1'>
        <Typography
          component={motion.span}
          initial={{x: -20}}
          animate={{x: 0, transition: {delay: 0.2}}}
          delay={300}
          className='hidden sm:flex text-20 mx-12'
        >
          Enrolled Tests
        </Typography>
        <div className='flex-1'>

        </div>
        <TextField
          color={"primary"}
          className='w-sm'
          size={"small"}
          value={search} onChange={(e) => setSearch(e.target.value)}
          label='Search tests by name'
        />


      </Box>
    }


    content={
      <Box className='p-24'>
        <Grid container spacing={2}>
          {tests
              .sort((a,b)=>_.reject(b.test_attempts, item => item.has_attempted === true || item.has_expired === true).length - _.reject(a.test_attempts, item => item.has_attempted === true || item.has_expired === true).length)
              .map(test => (
            <Grid item xs={3} spacing={2}>
              <TestCard test={test} type="ENROLLED"/>
            </Grid>
          ))}
        </Grid>
      </Box>
    }
    sidebarInner

  />
}

export default Tests;