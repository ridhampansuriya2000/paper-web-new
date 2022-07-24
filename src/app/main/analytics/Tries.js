import React from "react";
import {
    Avatar,
    Typography,
} from '@mui/material';
import {motion} from 'framer-motion';
import {useDispatch, useSelector} from 'react-redux';
import FusePageSimple from '../../../@fuse/core/FusePageSimple';
import {selectAuthRole, selectIsTeacher} from '../../auth/store/userSlice';
import {useEffect, useState} from "react";
import {getTriesValues, selecttries} from "../../store/Analytics/triesSlice";
import {MDBDataTable} from 'mdbreact';
import "./style/attemptResult.css"
import moment from "moment";
import { Link } from 'react-router-dom';

const Tries = () => {
    const dispatch = useDispatch();

    const user = useSelector(({auth}) => auth.user);

    const isTeacher = useSelector(selectIsTeacher)

    const triesList = useSelector((state) => selecttries(state));
    const [tabelData, setTabel] = useState();
    useEffect(() => {
        let array = triesList.data.map((item) => {
            let obj = {
                ...item,
                OpenTest : <Link style={{textDecoration : 'none', underline : 'none'}}
                               to={`/answer-sheet/${item.test}/${item.last_attempt}`}
                >
                    See Result
                </Link>,
                updated_at: moment(item?.updated_at).format('DD MMM YYYY')
            }
            return obj
        })

        setTabel(array);
    }, [triesList])

    useEffect(() => {
        fetchTests();
    }, [])

    const fetchTests = () => {
        dispatch(getTriesValues({params: {}}));
    }


    let data = {
        columns: [
            {
                label: 'Test Name',
                field: 'test__name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Date Attempted',
                field: 'updated_at',
                width: 100
            },
            {
                label: 'Total Questions',
                field: 'total_questions',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Average Score',
                field: 'avg_marks',
                sort: 'asc',    
                width: 150
            },
            {
                label: 'Marks Scored(Last Attempted)',
                field: 'marks_scored',
                sort: 'asc',
                width: 270
            },
            
            {
                label: 'Total Attempts',
                field: 'total_attempts',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Last Attempt(Last Attempted)',
                field: 'OpenTest',
                // sort: 'asc',
                width: 150
            }
        ],
        rows: tabelData || []
    };


    if (!isTeacher) {
        return (
            <div>
                <FusePageSimple
                    classes={{
                        contentWrapper: 'p-0 sm:p-24 h-full',
                        content: 'flex flex-col h-full',
                        wrapper: 'min-h-0',
                    }}
                    header={
                        <div className='flex items-center p-24 justify-between w-full border-b-1'>
                            <Avatar
                                src={user?.image || 'https://d10du6agr5zlzl.cloudfront.net/lolipop_dev/raw/stickers/default-profile-pic.jpg.webp'}
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

                        </div>
                    }
                    content={
                        <div className='flex flex-col p-24'>
                            <Typography className='py-12' variant='h5'>All Tests</Typography>
                            <MDBDataTable
                                striped
                                bordered
                                large
                                data={data}
                                className='your-custom-styles'
                            />
                        </div>
                    }
                    innerScroll
                />
            </div>
        );

    } else {
        return (
            <></>
        );

    }

};

export default Tries;
