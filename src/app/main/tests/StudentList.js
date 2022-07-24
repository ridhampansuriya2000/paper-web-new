import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {Box, Chip, Grid, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getAttemptsStudentList,
    selectStudentList
} from "../../store/AttemptedTests/attemtedTestsSlice";
import TestCard  from "./components/TestCard";

const StudentsList = () => {
  const dispatch = useDispatch();
  const testId = useParams();

  const StudentList = useSelector(selectStudentList);
  const [search, setSearch] = useState("")

  useEffect(() => {
      testId && fetchAttempts()
  }, [search,testId])

  const fetchAttempts = () => {
      testId &&  dispatch(getAttemptsStudentList({params: {...testId}, type: 'attempted'}))
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
          {StudentList.length ?
              StudentList.map((student,index) => (
            <Grid item xs={3} spacing={2}>
              <TestCard test={student} index={index} type="STUDENT_LIST" buttonLabel='See Attempts List'/>
            </Grid>
          ))
              :
          <div className='w-100 justify-content-center d-flex  font-weight-bolder'>
              <h1><b style={{color:"#0000FF"}}>No Test Has Been Attempted</b></h1>
          </div>}
        </Grid>
      </Box>
    }
    sidebarInner

  />
}

export default StudentsList;