import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {Box, Chip, Grid, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {getTests, selectTests} from "../../store/test/testsSlice";
import {getTeachersList, getCourseList, selectFilter} from "../../store/filterSlice";
import axios from "axios";
import {showMessage} from "../../store/fuse/messageSlice";
import TestCard from "./components/TestCard";
import {selectTestDetails} from "../../store/coursesSlice";
import MenuItem from '@mui/material/MenuItem';

const Tests = () => {
    const dispatch = useDispatch();

    const tests = useSelector(selectTests);

    const {params, count, next} = useSelector(({test}) => test.tests.all);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({
        ...params,
        course: '',
        teacher: '',
        publish: "True",
    });

    // const data = selectFilter(); {courseList, teacherList}
    const data = useSelector(selectFilter);

    useEffect(() => {
        fetchTests()
    }, [search]);

    const fetchTests = async () => {
        let objParams = {...params};
        objParams.publish = "True"
        // await dispatch(getTests({params: {...objParams, search}}))
        await dispatch(getTests({params: {...search}}))
        await dispatch(getTeachersList());
        await dispatch(getCourseList());
    }

    const purchaseTest = (testId) => {
        axios.post('orders/place/', {test: testId})
            .then(res => {
                dispatch(showMessage({
                    message: 'Test purchased successfully',
                    variant: 'success'
                }))
            })
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
                    🔍 Explore, Search Tests
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

        rightSidebarContent={
            <Box className='p-12 flex flex-col space-y-12'>
                {/*<TextField select label='Sort By' size={"small"}>*/}
                {/*  <MenuItem value={10}>Ten</MenuItem>*/}
                {/*  <MenuItem value={20}>Twenty</MenuItem>*/}
                {/*  <MenuItem value={30}>Thirty</MenuItem>*/}
                {/*</TextField>*/}
                <TextField
                    select
                    label='Filter By  Course'
                    size={"small"}
                    onChange={async (e) => {
                        await setFilter((preState) => ({
                            ...preState,
                            course: e.target.value
                        }))
                        await dispatch(getTests({params: {...{...filter, course: e.target.value}, search}}))
                    }}
                >
                    <MenuItem value=''>All</MenuItem>
                    {data.courseList.length > 0 &&
                    data.courseList.map((item) => (
                        <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select label='Filter By Teacher'
                    size={"small"}
                    onChange={async (e) => {
                        await setFilter((preState) => ({
                            ...preState,
                            teacher: e.target.value
                        }))
                        await dispatch(getTests({params: {...{...filter, teacher: e.target.value}, search}}))
                    }}
                >
                    <MenuItem value=''>All</MenuItem>
                    {data.teacherList.length > 0 &&
                    data.teacherList.map((item) => (
                        <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))
                    }
                </TextField>
            </Box>
        }

        content={
            <Box className='p-24'>
                <Grid container spacing={2}>
                    {tests.map(test => (
                        <Grid item xs={4} spacing={2}>
                            <TestCard test={test} type="EXPLORE"/>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        }
        sidebarInner

    />
}

export default Tests;