import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, TextField, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import clsx from "clsx";
import PointsInput from "../../shared-components/PointsInput";
import AttemptQuestion from "./components/AttemptQuestion";
import history from '@history'

// todo call the api for get test.
// todo attach full marks with attemped tests in normal test serializer
// todo fetch attempt for get detailed answer.


const Attempt = () => {
  const routeParams = useParams();

  // const [attempt, setAttempt] = useState(null)
  const [test, setTest] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isLastQuestion, setIsLasstQuestion] = useState(false);
  const [num,setNum] = useState([]);
  const [sumbitting,settIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false)

  const setNumArrray = (number) =>{
    num[number] = true;
    setNum([...num]);
  }


  // const fetchTest = () => {
  //   axios.get('attempts/' + routeParams.attemptId + '/')
  //     .then(res => {
  //       setAttempt(res.data)
  //     })
  // }


  useEffect(() => {
    // if (attempt && !test) {
    if (!test) {
      // axios.get('test/attempts/' + routeParams.id + '/')
      axios.get('test/get/' + routeParams.id + '/')
        .then(res => {
          setTest(res.data.data)
        })
    }
  }, [])

  const submitTest = () => {
   const res =  axios.post('attempts/submit/', {attempt: routeParams?.attemptId});
   return res;
  }

  useEffect(async () => {
    if(sumbitting && !num.some(item => item === false)){
      const res = await submitTest();
      await settIsSubmitting(false);
      // history.push('/dashboard');
      if(res.status === 200 ){history.push(`/answer-sheet/${routeParams?.id}/${routeParams?.attemptId}`)}
    }

    // fetchTest()
  }, [sumbitting])

  const startTest = () => {
    setActiveQuestion(test.main_questions[0]?.id)
  }
  const endTest = async () => {
      await setIsSaving(true);
      await setIsLasstQuestion(true);
      await settIsSubmitting(true);
    // await submitTest();
    // history.push('/dashboard')
  }

  const goBack = () => {
    history.goBack()
  }
  const goToHome = () => {
    history.push('/enrolled-tests')
  }

  if (!(test && test)) {
    return <Typography className='p-24'><CircularProgress size={16}/>&nbsp;Please wait, test is loading</Typography>
  }
  // if (attempt?.has_attempted <1) {
  if (test?.attempts < 1) {
    return <Typography>Test is already attempted <a href='/'>go back</a></Typography>
  }
  if (test?.has_expired) {
    return <Typography>Test has been expired <a href='/'>go back</a></Typography>
  }

  return (

    <FusePageSimple
      content={
        <Box className=''>
          {!activeQuestion && <Paper className="shadow-sm p-24 flex flex-col h-screen">
            <div className='flex flex-row justify-end'>
              <Button className='self-center' variant='outlined' onClick={goToHome}>
                Go To Home
              </Button>
            </div>
            <Typography variant='h5'>{test.name}</Typography>
            <Typography><b>Course:</b> {test.course?.name}</Typography>
            <Typography><b>Instructions:</b>
              {test.instructions}
            </Typography>


            <div className='flex-1'/>
            <Box className='flex flex-row space-x-24 justify-end'>
              <Button className='self-center' variant='outlined' onClick={goBack}>Go Back</Button>
              <Button className='self-center' variant='contained' color={"secondary"} onClick={startTest}>Start
                Test</Button>
            </Box>
          </Paper>
          }
          {
            test.main_questions.map((main_question, index) => (
              <Paper className={clsx("shadow-sm p-24 flex flex-col h-screen", main_question.id !== activeQuestion && "hidden")}>
                <div className='flex flex-row justify-end'>
                    <Button variant={'contained'}
                            color={"primary"}
                            onClick={goToHome}
                            className='bg-red-500 hover:bg-red-700'
                    >Abort Test</Button>

                </div>
                <Box className='mb-12 overflow-y-auto'>
                  <Typography className='font-semibold'>{main_question.heading}</Typography>
                  {main_question.sections.map(section => (
                    <Box className='mt-24 '>
                      <Typography color='textSecondary' variant='p'><b>Part {section.name}</b>: {section.type}
                      </Typography>
                      {section.questions.map((question, index) => (
                        <AttemptQuestion activeQuestion={activeQuestion}
                                         question={question}
                                         attempt={routeParams?.attemptId}
                                         isLastQuestion={isLastQuestion}
                                         submitTest={submitTest}
                                         indexNum={index}
                                         setNumArrray={setNumArrray}
                                         setIsSaving={setIsSaving}
                                         isSaving={isSaving}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>

                <div className='flex-1'/>
                <Box className='flex flex-row space-x-24 justify-end'>
                  {index > 0 && (
                    <Button variant={'outlined'}
                            disabled={index === 0}
                            onClick={() => setActiveQuestion(test.main_questions[index - 1].id)}>Previous</Button>
                  )}
                  {index !== test.main_questions.length - 1 && (
                    <Button variant={'contained'}
                            disabled={index === test.main_questions.length - 1}
                            onClick={async () => {
                              setActiveQuestion(test.main_questions[index + 1].id)
                              setIsSaving(true);
                            }}>Next</Button>
                  )}
                  {index === test.main_questions.length - 1 && (
                    <Button variant={'contained'}
                            color={"primary"}
                            onClick={()=>endTest()}
                            className='bg-green-500 hover:bg-green-700'
                    >Submit Test</Button>

                  )}
                </Box>
              </Paper>
            ))
          }
        </Box>
      }
      leftSidebarContent={
        <Box className='flex flex-col space-y-12'>
          <Paper className="shadow-sm p-8 flex flex-col">
            <Typography variant='h6'>{test.name}</Typography>
          </Paper>
          <Box className='flex flex-row flex-wrap px-4'>
            {test.main_questions.map((main_question, index) => (
              <div
                key={index}
                onClick={() => activeQuestion && setActiveQuestion(main_question.id)}
                className={clsx('m-4 h-32 w-32 bg-white rounded-full border-2 flex items-center justify-center ', activeQuestion && 'cursor-pointer', main_question.id === activeQuestion && "border-blue-500")}>
                <Typography className='text-md'>{index + 1}</Typography></div>
            ))}
          </Box>
        </Box>
      }
    />
  )
}

export default Attempt


/*
* todo required changes in backend api
* create a table AttemptedTest
* student answer : change option to options(m2m field) update dependencies
* save answer question by question
*
* */