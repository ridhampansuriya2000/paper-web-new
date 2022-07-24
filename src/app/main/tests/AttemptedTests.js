import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {Box, Chip, Grid, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {getTests, selectAttemptedTests, selectEnrolledTests, selectTests} from "../../store/test/testsSlice";
import {getTestsForTeacher, selectAttemtedTestsForTeacher} from "../../store/AttemptedTests/attemtedTestsSlice";
import axios from "axios";
import {showMessage} from "../../store/fuse/messageSlice";
import {selectAuthRole, selectIsTeacher} from '../../auth/store/userSlice';
import TestCard from "./components/TestCard";

const AttemptedTests = () => {
  const dispatch = useDispatch();
  const isTeacher = useSelector(selectIsTeacher)
  const teacherId = useSelector((state) =>state.auth.user.id);


  const [search, setSearch] = useState("")
  useEffect(() => {
    fetchTests()
  }, [search])

  const tests = useSelector(isTeacher ? selectAttemtedTestsForTeacher : selectAttemptedTests  );

  const {params, count, next,list} = useSelector(({test}) => test.tests.attempted)



  const fetchTests = () => {
    if(isTeacher){
      dispatch(getTestsForTeacher({params: {...params,teacherId : teacherId}, type: 'attempted'}))
    }else{
      dispatch(getTests({params: {...params, search}, type: 'attempted'}))
    }
  }

if(isTeacher){
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
                {(tests || [])?.map(test => (
                    <Grid item xs={3} spacing={2}>
                      <TestCard test={test} type="ATTEMPTED BY STUDENT" buttonLabel='See Attempted Tests'/>
                    </Grid>
                ))}
              </Grid>
            </Box>
          }
          sidebarInner

      />
}else {
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
            {tests.map(test => (
                <Grid item xs={3} spacing={2}>
                  <TestCard
                      test={{...test, extraData : list.find((item)=> item.id === test.id)}}
                      type="ATTEMPTED"
                  />
                </Grid>
            ))}
          </Grid>
        </Box>
      }
      sidebarInner

  />
}

}

export default AttemptedTests;