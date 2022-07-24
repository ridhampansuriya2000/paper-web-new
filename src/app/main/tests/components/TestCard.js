import Paper from "@mui/material/Paper";
import {Card, Chip, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import axios from "axios";
import {showMessage} from "../../../store/fuse/messageSlice";
import {useDispatch} from "react-redux";
import React from "react";
import {useHistory} from 'react-router-dom';
import _ from "lodash";
import moment from "moment";

export default function ({test, type, buttonLabel = 'See Result', index}) {
    const dispatch = useDispatch()
    // type EXPLORE, ATTEMPTED, ENROLLED, // later -> TEACHER
    let history = useHistory();

    const purchaseTest = () => {
        axios.post('orders/place/', {test: test.id})
            .then(res => {
                dispatch(showMessage({
                    message: 'Test purchased successfully',
                    variant: 'success'
                }))
            })
    }


    return (
        <Card className='flex flex-col space-y-4 shadow-sm rounded-16'>
            <div className='flex flex-row justify-between'>
                <Chip className='self-start rounded-none rounded-br-8'
                      variant={'contained'}
                      size={"small"}
                      label={test?.course?.name || test.test__course__name || (index + 1)}/>
            </div>
            <Typography className='pl-12 pt-12' variant='p text-18'>{test.name || test.test__name}</Typography>
            {type === "ENROLLED" ?
                <Typography color={"textSecondary"} className='pl-12 text-sm'>
                    {_.reject(test.test_attempts, item => item.has_attempted === true || item.has_expired === true).length} Attempts Remaining
                </Typography>
                : type === 'ATTEMPTED_LIST' ?
                    null :
                    type === 'STUDENT_LIST' ?
                        <>
                            <Typography color={"textSecondary"} className='pl-12 text-sm'>
                                <b>Student </b>{test?.user__name}
                            </Typography>
                            <Typography color={"textSecondary"} className='pl-12 text-sm'>
                                <b>Attempts: </b>{test?.attempts}
                            </Typography>
                        </> :
                        type === 'ATTEMPTED_TEST_LIST' ?
                            <Typography color={"textSecondary"} className='pl-12 text-sm'>
                                <b>Attempt Date: </b>{moment(test?.updated_at).format('DD MMM YYYY')}
                                <br/>
                                <b>Marks Scored: </b>{test?.marks_scored}
                            </Typography> :
                            type === 'ATTEMPTED' ?
                            <Typography color={"textSecondary"} className='pl-12 text-sm d-flex flex-column'>
                                <div><b>Teacher: </b>{test.teacher.name}</div>
                                <div><b>Attempted Count: </b>{test?.extraData?.attempt_count}</div>
                            </Typography> :
                            <Typography color={"textSecondary"} className='pl-12 text-sm d-flex flex-column'>
                            <div><b>Teacher: </b>{test.teacher.name}</div>
                            </Typography>
            }
            {type === 'ATTEMPTED_LIST' &&
            <>
                <Typography color={"textSecondary"} className='pl-12 text-sm'>
                    <b>Attempt </b>{index + 1}
                </Typography>
                <Typography color={"textSecondary"} className='pl-12 text-sm'>
                    <b>Attempt Date:</b> {moment(test?.updated_at).format('DD MMM YYYY')}
                    <br/>
                    <b>Marks Scored: </b>{test?.marks_scored}
                </Typography>
            </>
            }
            {type === "EXPLORE" && (
                <div>
                    <Typography className='pl-12 text-12'
                                variant='p'
                                color={"textSecondary"}><b>Attempts:</b> {test.attempts}</Typography>
                    <Typography className='pl-12 text-12 uppercase'
                                variant='p'
                                color={"textSecondary"}><b>Price:</b> {test.price}</Typography>

                </div>

            )}
            <div className='flex-1'/>
            <div className='flex flex-col'>

                <Divider/>
                {type === "EXPLORE" && (
                    <Button variant='text' onClick={purchaseTest} color='secondary'>
                        Purchase
                    </Button>
                )}
                {type === "ENROLLED" && (
                    <Button variant='text' component={Link}
                            disabled={_.reject(test.test_attempts, item => item.has_attempted === true || item.has_expired === true).length > 0 ? false : true}
                            to={`attempt/${test.id}/${test.test_attempts?.filter(elm => elm.has_attempted === false && elm.has_expired === false)[0]?.id}`}
                            color='secondary'>
                        Attempt Test
                    </Button>
                        // <Button variant='text' component={Link} to={`attempt/${_.reject(test.test_attempts, item=>item.has_attempted===true || item.has_expired===true)?.[0]?.id}`} color='secondary'>
                    //   Attempt Test
                    // </Button>
                )}
                {type === "ATTEMPTED" && (
                    <Button variant='text' component={Link} color='secondary'
                            to={`attempted-test/${test.id}`}
                    >
                        {buttonLabel}
                    </Button>
                )}
                {type === "ATTEMPTED_LIST" && (
                    <Button variant='text' component={Link} color='secondary'
                        // to={`attempted-test/${test.test}/${test.id}`}
                            to={`/answer-sheet/${test.test}/${test.id}`}
                    >
                        {buttonLabel}
                    </Button>
                )}
                {type === "ATTEMPTED BY STUDENT" && (
                    <Button variant='text' component={Link} color='secondary'
                            to={`/attempted-test/students/${test.id}`}
                    >
                        {buttonLabel}
                    </Button>
                )}
                {type === "STUDENT_LIST" && (
                    <Button variant='text' component={Link} color='secondary'
                            to={`/attempted-test/students/${test.test}/${test.user}`}
                    >
                        {buttonLabel}
                    </Button>
                )}
                {type === "ATTEMPTED_TEST_LIST" && (
                    <Button variant='text' component={Link} color='secondary'
                            to={`/attempted-test/students/${test.test}/${test.studentId}/${test.id}`}
                    >
                        {buttonLabel}
                    </Button>
                )}

            </div>
        </Card>
    )
}