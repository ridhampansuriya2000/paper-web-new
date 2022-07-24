import {
  Avatar, Chip, Grid,
  Icon, TextField,
  Typography,
} from '@mui/material';
import {motion} from 'framer-motion';
import {useDispatch, useSelector} from 'react-redux';
import FusePageSimple from '../../../@fuse/core/FusePageSimple';
import {selectAuthRole, selectIsTeacher} from '../../auth/store/userSlice';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {getTests, selectAttemptedTests, selectEnrolledTests, selectTests} from "../../store/test/testsSlice";
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";
import TestCard from "../tests/components/TestCard";

const Dashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector(({auth}) => auth.user);
  const tests = useSelector(selectTests)
  const allTests = useSelector((state) => selectTests(state, 5))
  const enrolledTests = useSelector((state) => selectEnrolledTests(state, 5))
  const attemptedTests = useSelector((state) => selectAttemptedTests(state, 5))
  const {params, count, next} = useSelector(({test}) => test?.tests?.all)
  const {
    params: enrolledTestsParams,
    count: enrolledTestsCount,
    next: enrolledTestsNext
  } = useSelector(({test}) => test?.tests?.enrolled)
  const {
    params: attemptedTestsParams,
    count: attemptedTestsCount,
    next: attemptedTestsNext
  } = useSelector(({test}) => test?.tests?.attempted)
  const {params: allTestsParams, count: allTestsCount, next: allTestsNext} = useSelector(({test}) => test.tests.all)

  const isTeacher = useSelector(selectIsTeacher)

  const [teacher, setTeacher] = useState(isTeacher ? user.id : null)
  const [search, setSearch] = useState(params?.search ?? "")

  useEffect(() => {
    fetchTests()
  }, [search, teacher])

  const fetchTests = () => {
    isTeacher && dispatch(getTests({params: {...params, teacher, search}}))
    if (!isTeacher) {
      dispatch(getTests({params, type: 'all'}))
      dispatch(getTests({params: enrolledTestsParams, type: 'enrolled'}))
      dispatch(getTests({params: attemptedTestsParams, type: 'attempted'}))
    }
  }


  if (isTeacher) {
    return (
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          wrapper: 'min-h-0',
        }}
        header={
          <div className='flex items-center p-24 justify-between w-full border-b-1'>
            <Avatar src={user?.image || 'https://d10du6agr5zlzl.cloudfront.net/lolipop_dev/raw/stickers/default-profile-pic.jpg.webp'}
                    className='h-48 w-48'/>
            <Typography
              component={motion.span}
              initial={{x: -20}}
              animate={{x: 0, transition: {delay: 0.2}}}
              delay={300}
              className='hidden sm:flex text-20 mx-12'
            >
              Welcome, {user?.name}
            </Typography>
            <div className='flex-1'>

            </div>
            <TextField
              color={"primary"}
              className='w-xs'
              size={"small"}
              value={search} onChange={(e) => setSearch(e.target.value)}
              label='Search tests by name'
            />

          </div>
        }
        content={
          <div className='flex flex-col p-24'>
            {/*<div className='flex flex-row space-x-24'>*/}
            {/*  <Paper className='p-24 shadow-sm'>*/}
            {/*    <Typography variant='h4' className='font-light'>15</Typography>*/}
            {/*    <Typography variant='h6' color={'textSecondary'} className='font-light'>Total test*/}
            {/*      created</Typography>*/}
            {/*  </Paper>*/}
            {/*  <Paper className='p-24 shadow-sm'>*/}
            {/*    <Typography variant='h4' className='font-light'>200</Typography>*/}
            {/*    <Typography variant='h6' color={'textSecondary'} className='font-light'>Total test*/}
            {/*      attempted</Typography>*/}
            {/*  </Paper>*/}
            {/*  <Paper className='p-24 shadow-sm'>*/}
            {/*    <Typography variant='h4' className='font-light'>160</Typography>*/}
            {/*    <Typography variant='h6' color={'textSecondary'} className='font-light'>Students*/}
            {/*      Attempted</Typography>*/}
            {/*  </Paper>*/}
            {/*  <Paper className='p-24 shadow-sm'>*/}
            {/*    <Typography variant='h4' className='font-light'>230$</Typography>*/}
            {/*    <Typography variant='h6' color={'textSecondary'} className='font-light'>Earned this*/}
            {/*      month</Typography>*/}
            {/*  </Paper>*/}
            {/*</div>*/}
            <Typography className='py-12' variant='h5'>All Tests</Typography>
            <Grid container spacing={2}>
              {tests?.map(test => (
                <Grid item xs={3} spacing={2}>
                  <Paper className='flex flex-col h-200 space-y-4 shadow-sm'>
                    <div className='flex flex-row justify-between'>
                      <Chip className='self-start rounded-none rounded-br-8'
                            variant={'contained'}
                            size={"small"}
                            label={test?.course?.name}/>
                      <Typography color={"textSecondary"} className='pr-4'>Live <span className='text-green'>•</span>
                      </Typography>
                    </div>
                    <Typography className='pl-24 pt-24' variant='p text-20'>{test?.name}</Typography>
                    <div className='flex-1'/>
                    <div className='flex flex-col'>
                      <Divider/>
                      <Button variant='text'
                              component={Link}
                              color='secondary'
                              to={'/manage/' + test?.id}>Manage Test</Button>

                    </div>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>
        }
        innerScroll
      />
    );

  } else {
    return (
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          wrapper: 'min-h-0',
        }}
        header={
          <div className='flex items-center p-24 justify-between w-full border-b-1'>
            <Avatar src={user.image || 'https://d10du6agr5zlzl.cloudfront.net/lolipop_dev/raw/stickers/default-profile-pic.jpg.webp'}
                    className='h-48 w-48'/>
            <Typography
              component={motion.span}
              initial={{x: -20}}
              animate={{x: 0, transition: {delay: 0.2}}}
              delay={300}
              className='hidden sm:flex text-20 mx-12'
            >
              Welcome, {user.name}
            </Typography>
            <div className='flex-1'>

            </div>
            <TextField
              color={"primary"}
              className='w-xs'
              size={"small"}
              value={search} onChange={(e) => setSearch(e.target.value)}
              label='Search tests by name'
            />

          </div>
        }
        content={
          <div className='flex flex-col p-24'>
            <Typography className='py-12' variant='h5' color={"secondary"}>Explore Tests</Typography>
            <Grid container spacing={2}>
              {allTests.map(test => (
                <Grid item xs={2.5} spacing={2}>
                  <TestCard test={test} type="EXPLORE"/>
                </Grid>
              ))}
            </Grid>
            <Typography className='py-12' variant='h5' color={"secondary"}>Enrolled Tests</Typography>
            <Grid container spacing={2}>
              {enrolledTests.map(test => (
                <Grid item xs={2.5} spacing={2}>
                  <TestCard test={test} type="ENROLLED"/>
                </Grid>
              ))}
            </Grid>
            <Typography className='py-12' variant='h5' color={"secondary"}>Attempted Tests</Typography>
            <Grid container spacing={2}>
              {attemptedTests.map(test => (
                <Grid item xs={2.5} spacing={2}>
                  <TestCard test={test} type="ATTEMPTED"/>
                </Grid>
              ))}
            </Grid>
          </div>
        }
        innerScroll
      />
    );

  }

};

export default Dashboard;
