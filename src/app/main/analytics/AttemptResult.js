import React from "react";
import {
  Avatar,
  Typography,
} from '@mui/material';
import {motion} from 'framer-motion';
import {useDispatch, useSelector} from 'react-redux';
import FusePageSimple from '../../../@fuse/core/FusePageSimple';
import {selectIsTeacher} from '../../auth/store/userSlice';
import {useEffect, useState} from "react";
import {getAttemptResultValues, selectAttemptResult} from "../../store/Analytics/attemtResultSlice";
import { MDBDataTable } from 'mdbreact';
import moment from 'moment';
import "./style/attemptResult.css"
import { Link } from 'react-router-dom';


const AttemptResult = () => {
  const dispatch = useDispatch();

  const user = useSelector(({auth}) => auth.user);
  const isTeacher = useSelector(selectIsTeacher)
  const [teacher, setTeacher] = useState(isTeacher ? user.id : null)
  const attemptResult = useSelector((state)=> selectAttemptResult(state));


  const [tableData,setTable] = useState();
  useEffect(()=>{
      // let var = `<Link to='${attempted_test__test__name}' />`
      let array = attemptResult.data.map((item)=>{

          let obj = {
              ...item,
              test_name : item.attempted_test__test__name,
              OpenTest : <Link style={{textDecoration : 'none', underline : 'none'}}
                               to={`/attempted-test/students/${item.test}/${item.user}/${item.id}`}
              >
                  See Result
              </Link>,
              updated_at : moment(item?.updated_at).format('DD MMM YYYY'),
              // attempted_test__test__name : <Link style={{textDecoration : 'none', underline : 'none'}}
              //                                    // to={`/attempted-test/students/${item.attempted_test}/${item.attempted_test__user}/${item.attempted_test__test}`}
              //                                    to={`/attempted-test/students/${item.attempted_test__test}/${item.attempted_test__user}/${item.attempted_test}`}
              //                               >
              //                                    {item.attempted_test__test__name}
              //                               </Link>,
          } 
          return obj
      })

      setTable(array);
  },[attemptResult])

  useEffect(() => {
    fetchTests();
  }, [teacher])

  const fetchTests = () => {
      dispatch(getAttemptResultValues({params : {}}));
    }


    let data = {
        columns: [
            {
                label: 'Student Name',
                field: 'user__name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Test Name',
                field: 'test__name',
                sort: 'asc',
                width: 270
            },
            // {
            //     label: 'Total Attemted Test',
            //     field: 'attempted_test__test',
            //     sort: 'asc',
            //     width: 200
            // },
            {
                label: 'Date Attempted',
                field: 'updated_at',
                width: 100,
                render : (rowData) =>{
                    return moment(rowData?.updated_at).format('YYYY-MM-DD');
                }
            },
            {
                label: 'Marks',
                field: 'marks',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Test links',
                field: 'OpenTest',
                // sort: 'asc',
                width: 100
            }
        ],
        rows: tableData || []
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
