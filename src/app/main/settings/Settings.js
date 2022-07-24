import {
  Avatar, Box,
  Icon, IconButton, TextField,
  Typography,
} from '@mui/material';
import {motion} from 'framer-motion';
import {useDispatch, useSelector} from 'react-redux';
import FusePageSimple from '../../../@fuse/core/FusePageSimple';
import {selectAuthRole, updateUser} from '../../auth/store/userSlice';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useEffect, useRef, useState} from "react";
import {getTests, selectTests} from "../../store/test/testsSlice";
import {Link} from "react-router-dom";
import {Camera, Edit, PendingActionsSharp} from "@mui/icons-material";
import {column} from "stylis";
import {getCourses, selectCourses} from "../../store/coursesSlice";
import MenuItem from "@mui/material/MenuItem";

const Settings = () => {
  const dispatch = useDispatch();

  const user = useSelector(({auth}) => auth.user);
  const tests = useSelector(selectTests)
  const {params, count, next} = useSelector(({test}) => test.tests.all)
  const courses = useSelector(selectCourses)

  const [teacher, setTeacher] = useState(user.role === "TEACHER" ? user.id : null)
  const [search, setSearch] = useState(params?.search ?? "")

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [gender, setGender] = useState(user.gender)
  const [course, setCourse] = useState(user.course)

  const [image, setImage] = useState(null)

  const imageUploadInput = useRef()

  useEffect(() => {
    dispatch(getCourses())
  }, [])

  const handleUpdate = () => {
    const data = {
      name,
      email,
      gender,
      course,
      image
    }
    dispatch(updateUser(data))
  }


  return (
    <FusePageSimple
      classes={{
        contentWrapper: 'p-0 sm:p-24 h-full',
        content: 'flex flex-col h-full',
        wrapper: 'min-h-0',
      }}
      header={
        <div className='flex items-center p-24 justify-between w-full border-b-1 bg-white'>
          <Typography
            component={motion.span}
            initial={{x: -20}}
            animate={{x: 0, transition: {delay: 0.2}}}
            delay={300}
            color={'primary'}
            className='text-20 mx-12'
          >
            <Edit/>&nbsp;Edit Profile
          </Typography>
        </div>
      }
      content={
        <div className='p-24 flex flex-col'>
          <Paper className='shadow p-24 space-y-12 self-start'>
            <div className='flex flex-col space-y-24'>
              <div className='relative self-start'>
                <Avatar src={image ? URL.createObjectURL(image) : user.image || 'https://d10du6agr5zlzl.cloudfront.net/lolipop_dev/raw/stickers/default-profile-pic.jpg.webp'}
                        className='h-200 w-200 shadow'/>
                <IconButton onClick={() => imageUploadInput?.current?.click()}
                            className='bg-white hover:bg-white bottom-10 right-10 absolute shadow-lg'>
                  <Edit/>
                </IconButton>
                <input className={'absolute'} type="file" ref={imageUploadInput}
                       style={{visibility: 'hidden'}} onChange={(e) => setImage(e.target.files[0])}/>
              </div>
              <Box className='space-y-12 flex flex-col'>
                <TextField variant={"standard"}
                           value={name}
                           onChange={e => setName(e.target.value)}
                           variant={"standard"}
                           label='First Name'
                           className='w-xs'/>
                <TextField select
                           variant={"standard"}
                           value={course}
                           onChange={e => setCourse(e.target.value)}
                           variant={"standard"}
                           label='Course'
                           className='w-xs'>
                  {courses.map(res => (
                    <MenuItem value={res.id}>{res.name}</MenuItem>
                  ))}
                </TextField>
                <TextField variant={"standard"}
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           label='Email ID'
                           className='w-xs'/>
                <TextField select
                           variant={"standard"}
                           value={gender}
                           onChange={e => setGender(e.target.value)}
                           variant={"standard"}
                           label='Gender'
                           className='w-xs'>
                  <MenuItem value={'Male'}>Male</MenuItem>
                  <MenuItem value={'Female'}>Female</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
                </TextField>
                <Button onClick={handleUpdate} variant={"contained"} className='self-start'>Save</Button>


              </Box>
            </div>
          </Paper>
        </div>
      }
      innerScroll
    />
  );
};

export default Settings;
