import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createTest, getTest, selectTest, updateTest} from "../../../store/test/testsSlice";
import {
  getCourses,
  getDifficulty,
  getLanguage,
  getTestDetails,
  selectCourses, selectDificultyList, selectLanguageList,
  selectTestDetails
} from "../../../store/coursesSlice";
import {useParams} from "react-router-dom";
import Paper from "@mui/material/Paper";
import {Button, LinearProgress, TextField, Autocomplete, Box} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import history from '@history'
import {showMessage} from "../../../store/fuse/messageSlice";
import AddCourseDailog from "./AddCourseDailog";
import axios from "axios";

const EditTestDetails = ({test = null, isCreatMode=false}) => {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const courses = useSelector(selectCourses);
  const difficultyList = useSelector(selectDificultyList);
  const languagesList = useSelector(selectLanguageList);
  const testDetails = useSelector(selectTestDetails);

  const [name, setName] = useState(test?.name ?? '');
  const [attempts, setAttempts] = useState(test?.attempts ?? '');
  const [course, setCourse] = useState( null);
  const [language, setLanguag] = useState( null);
  const [difficulty, setDifficulty] = useState( null);
  const [expiresInDays, setExpiresInDays] = useState(test?.expires_in_days ?? '');
  // const [price, setPrice] = useState(test?.price ?? '');
  const [price, setPrice] = useState(0);
  const [instructions, setInstructions] = useState(test?.instructions ?? '');
  const [progress, setProgress] = useState(false);
  const [openCourseDailog, setOpenCourseDailog] = useState(false);


  useEffect(() => {
    dispatch(getCourses());
    dispatch(getLanguage());
    dispatch(getDifficulty());
    dispatch(getTestDetails({id : routeParams?.id}));
  }, []);

  useEffect(()=>{
    if(test && languagesList.length && difficultyList.length && courses.length ){
      setCourse(()=>{
        let obj = courses.length && courses?.find((item)=>item?.id === test?.course);
        return {
          id : obj?.id,
          label : obj?.name
        }
      })

      setLanguag(()=>{
        let obj = languagesList.length && languagesList?.find((item)=>item?.id === test?.language);
        return {
          id : obj.id,
          label : obj.language
        }
      })

      setDifficulty(()=>{
        let obj = difficultyList.length && difficultyList?.find((item)=>item?.id === test?.difficulty_level);
        return {
          id : obj.id,
          label : obj.level
        }
      })
    }

  },[test,languagesList,difficultyList,courses])

  useEffect(()=>{
    if(courses.length > 0 && !test){
      let tempObj = courses.find((item)=> item.id === 29)
      let obj = {
      id: tempObj.id,
      label: tempObj.name
    }
    courses.length > 0 && setCourse({...obj});
}
    if(languagesList.length > 0 && !test){
      let tempObj = languagesList.find((item)=> item.id === 13)
      let obj = {
        id: tempObj.id,
        label: tempObj.language
      }
      setLanguag({...obj});
    }
    if(difficultyList.length > 0 && !test){
      let tempObj = difficultyList.find((item)=> item.id === 3)
      let obj = {
        id: tempObj.id,
        label: tempObj.level
      }
       setDifficulty({...obj});
    }
  },[courses,languagesList,difficultyList]);


  const showErr = (msg) => {
    dispatch(showMessage({
      message: msg,
      variant: 'error'
    }))
  }

  const handleCreateTest = () => {
    if (name === "")
      return showErr('Test Name is required')
    if (attempts === "")
      return showErr('Attempts is required')
    if (!course)
      return showErr('Course is required')
    if (expiresInDays === "")
      return showErr('Expires in days is required')
    if (price === "")
      return showErr('Price is required')
    if (price === "")
      return showErr('Price is required')
    if (!difficulty?.id)
      return showErr('Difficulty level is required')
    if (!language?.id)
      return showErr('Language is required')
    setProgress(true)
    dispatch(createTest({name, attempts, course: course.id, expires_in_days: expiresInDays, price, instructions, language : language.id, difficulty_level : difficulty.id }))
      .unwrap()
      .then(res => {
        setProgress(false)
        console.log(res)
        history.push(`/manage/${res.result}`)
      }).catch(err => {
      setProgress(false)
    })
  }
  const handleUpdateTest = () => {
    setProgress(true)
    dispatch(updateTest({id: test.id, name, attempts, course: course.id, expires_in_days: expiresInDays, price, instructions,  language : language.id, difficulty_level : difficulty.id }))
      .unwrap()
      .then(res => {
        setProgress(false)
      }).catch(err => {
      setProgress(false)
    })
  }

  const getOptions = () =>{
    let arr = courses.map((item)=>({label : item.name, id: item.id})) || [];
    arr = [{label : '+add course', id: 'new', color:'#880b88'},...arr];
    return arr;
  }

  const getLanguageOptions = () =>{
    let arr = languagesList.map((item)=>({label : item.language, id: item.id})) || [];
    return arr;
  }

  const getDificultyOptions = () =>{
    let arr = difficultyList.map((item)=>({label : item.level, id: item.id})) || [];
    return arr;
  }

  const addCourse = (data) =>{
    axios.post('create/course/', data)
        .then(async ({data}) => {

          // show message
          dispatch(showMessage({
            message: 'Course Added!',
            variant: 'success'
          }));
         await dispatch(getCourses())
         await dispatch(getTestDetails({id : routeParams?.id}));
          setCourse({id : data.data[0].id, label : data.data[0].name});
          setOpenCourseDailog(false);
          return true;
        }).catch(err=>{
      // show message
      dispatch(showMessage({
        message:err?.response?.data?.message??'Question create error',
        variant:'error'
      }))
      throw Error
      return false
    })
  }

  return (
   <Box sx={{display:'flex', flexDirection:'column', gap:'2rem'}}>
     <Paper className='flex flex-col p-24 space-y-12 shadow'>
       <div className='flex flex-row space-x-12'>
         <TextField value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='flex-1'
                    label='Enter test name here'/>
         {/*<TextField value={course}*/}
         {/*           id='course'*/}
         {/*           onChange={(e) => setCourse(e.target.value)}*/}
         {/*           className='w-xs'*/}
         {/*           label='Select Course'*/}
         {/*           select>*/}
         {/*  {courses.map(course => (*/}
         {/*    <MenuItem value={course.id} id={`course${course.id}`}>{course.name}</MenuItem>*/}
         {/*  ))}*/}
         {/*  <MenuItem value={''} onClick={()=>setOpenCourseDailog(true)}>Add Other Course</MenuItem>*/}
         {/*</TextField>*/}
         <Autocomplete
             disablePortal
             id="combo-box-demo"
             options={getOptions()}
             sx={{ width: 300 }}
             value={course}
             onChange={(e,value) => {
               if(value.id !== 'new') setCourse(value);
               if(value.id === 'new') setOpenCourseDailog(true);
             }}
             getOptionLabel={(option) => option.label ?? option}
             renderTags={(option) => {
               return courses.find((item)=> item.id === option).label;
             }}
             renderOption={(props, option) => {
               const {label, color} = option;
               return (
                   <span {...props} style={{ color: color ?? ''}}>
                        {label}
                    </span>
               );
             }}
             // renderOption={(props, option) => option.label ?? option}
             // renderOption={(props, option) => <MenuItem value={option.id}>{option.label}</MenuItem>}
             renderInput={(params) => <TextField {...params} label="Select Course"/>}
         />
       </div>
       <TextField value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  label='Instructions'
                  multiline
                  maxRows={8}/>
       <div className='flex flex-row space-x-12'>
         <Autocomplete
             disablePortal
             id="Language"
             options={getLanguageOptions()}
             sx={{ width: 300 }}
             value={language}
             onChange={(e,value) => {
               setLanguag(value);
               // if(value.id === 'new') setOpenCourseDailog(true);
             }}
             getOptionLabel={(option) => option.label ?? option}
             renderTags={(option) => {
               return courses.find((item)=> item.id === option).label;
             }}
             // renderOption={(props, option) => option.label ?? option}
             // renderOption={(props, option) => <MenuItem value={option.id}>{option.label}</MenuItem>}
             renderInput={(params) => <TextField {...params} label="Select Language"/>}
         />

         <Autocomplete
             disablePortal
             id="Difficulty"
             options={getDificultyOptions()}
             sx={{ width: 300 }}
             value={difficulty}
             onChange={(e,value) => {
               setDifficulty(value);
               // if(value.id === 'new') setOpenCourseDailog(true);
             }}
             getOptionLabel={(option) => option.label ?? option}
             renderTags={(option) => {
               return courses.find((item)=> item.id === option).label;
             }}
             // renderOption={(props, option) => option.label ?? option}
             // renderOption={(props, option) => <MenuItem value={option.id}>{option.label}</MenuItem>}
             renderInput={(params) => <TextField {...params} label="Select Difficulty"/>}
         />
       </div>
       <div className='flex flex-row space-x-12'>
         <TextField
             // value={0}
             disabled
             value={price}
             onChange={(e) => setPrice(e.target.value)}
             label='Price'/>
         <TextField value={expiresInDays}
                    onChange={(e) => setExpiresInDays(e.target.value)}
                    label='Expiry in days after purchase'/>
         <TextField value={attempts}
                    onChange={(e) => setAttempts(e.target.value)}
                    label='Number of attemps per purchase'/>
         <Button variant={"contained"}
                 onClick={test ? handleUpdateTest : handleCreateTest}>{test ? "Update Test" : "Create Test"}
         </Button>
       </div>
       {progress && <LinearProgress/>}
       {openCourseDailog &&
       <AddCourseDailog
           openCourseDailog={openCourseDailog}
           onClose={()=>setOpenCourseDailog(false)}
           addCourse={addCourse}
       />}
     </Paper>
     {!isCreatMode && <Paper className='flex flex-col p-24 space-y-12 shadow' style={{border: '3px solid #aad4ff'}}>

       <div className='flex flex-row space-x-12 justify-content-between'>
         <div className='flex flex-column justify-content-center '>
           <h3 className='font-weight-bold' style={{color: "black"}}>
             Average Score
           </h3>
           <div className='flex justify-content-center align-items-center' style={{color:"#0000FF",fontSize: "20px", fontWeight: 'bold' }}>
             {testDetails?.average_score ?? 0}
           </div>
         </div>
         <div className='flex flex-column justify-content-center '>
           <h3 className='font-weight-bold' style={{color: "black"}}>
             Revenue
           </h3>
           <div className='flex justify-content-center align-items-center' style={{color:"#0000FF",fontSize: "20px", fontWeight: 'bold' }}>
             {testDetails?.revenue ?? 0}
           </div>
         </div>
         <div className='flex flex-column justify-content-center '>
           <h3 className='font-weight-bold' style={{color: "black"}}>
             Total Attempts
           </h3>
           <div className='flex justify-content-center align-items-center' style={{color:"#0000FF",fontSize: "20px", fontWeight: 'bold' }}>
             {testDetails?.total_attempts ?? 0}
           </div>
         </div>
       </div>
     </Paper>}
   </Box>
  )

}

export default EditTestDetails;