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
import {getTestCreatedResultValues, selectTestCreatedResult} from "../../store/Analytics/testCreatedResultSlice";
import { MDBDataTable } from 'mdbreact';
import "./style/attemptResult.css"
import moment from "moment";


const AttemptResult = () => {
  const dispatch = useDispatch();

  const user = useSelector(({auth}) => auth.user);

  const isTeacher = useSelector(selectIsTeacher)

  const [teacher, setTeacher] = useState(isTeacher ? user.id : null)

    const testCreatedResult = useSelector((state)=> selectTestCreatedResult(state));
    console.log(testCreatedResult)
  const [tabelData,setTabel] = useState();
  useEffect(()=>{
      let array = testCreatedResult.data.map((item)=>{
          let obj = {
              ...item,
              created_at : moment(item?.created_at).format('DD MMM YYYY')
          }
          return obj
      })

      setTabel(array);
  },[testCreatedResult])

  useEffect(() => {
    fetchTests();
  }, [ teacher])

  const fetchTests = () => {
      dispatch(getTestCreatedResultValues({params : {}}));
    }


    let data = {
        columns: [
            {
                label: 'Test Name',
                field: 'name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Date Created',
                field: 'created_at',
                sort: 'asc',
                width: 270
            },
            {
                label: 'Price',
                field: 'price',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Revenue Generated',
                field: 'revenue_generate',
                width: 100
            },
            {
                label: 'Number Of Student Purchase',
                field: 'student_purchase',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Total Attempt',
                field: 'total_attempt',
                sort: 'asc',
                width: 100
            },
            // {
            //     label: 'Remaining Attempt',
            //     field: 'remaining_attempt',
            //     sort: 'asc',
            //     width: 100
            // }
        ],
        rows: tabelData || []
    };


  if (isTeacher) {
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
     <> </>
    );

  }

};

export default AttemptResult;
