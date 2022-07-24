import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, TextField, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import clsx from "clsx";
import PointsInput from "../../shared-components/PointsInput";
import { selectIsTeacher} from '../../auth/store/userSlice';
import AttemptQuestion from "./components/AttemptQuestion";
import history from '@history'
import {useSelector} from "react-redux";

// todo call the api for get test.
// todo attach full marks with attemped tests in normal test serializer
// todo fetch attempt for get detailed answer.


const AnswerSheet = () => {
  const routeParams = useParams();

  const isTeacher = useSelector(selectIsTeacher)

  // const [attempt, setAttempt] = useState(null)
  const [test, setTest] = useState({
    "id": 25,
    "name": "sdj",
    "course": {
      "id": 1,
      "name": "python"
    },
    "teacher": 2,
    "expires_in_days": 18,
    "attempts": 15,
    "price": "4.00",
    "created_at": "2022-03-30T15:31:07.239567Z",
    "updated_at": "2022-03-30T15:31:07.239567Z",
    "instructions": "jbdfd",
    "main_questions": [
      {
        "id": 42,
        "test": 25,
        "heading": "sdf",
        "sections": [
          {
            "id": 134,
            "main_question": 42,
            "name": "A",
            "type": "SUBJECTIVE",
            "questions": [
              {
                "id": 64,
                "section": 134,
                "text": "sdf",
                "sequence": 0,
                "marks": 4,
                "options": [],
                "subjective_answer": null,
                "points_answer": null,
                "table_answer": null,
                "type": "SUBJECTIVE"
              }
            ],
            "type_display": "Subjective"
          },
          {
            "id": 135,
            "main_question": 42,
            "name": "B",
            "type": "MCQ",
            "questions": [
              {
                "id": 65,
                "section": 135,
                "text": "ds",
                "sequence": 0,
                "marks": 5,
                "options": [
                  {
                    "id": 75,
                    "question": 65,
                    "text": "dsf",
                    "is_correct": false,
                    "sequence": 0
                  },
                  {
                    "id": 76,
                    "question": 65,
                    "text": "dg",
                    "is_correct": false,
                    "sequence": 0
                  }
                ],
                "subjective_answer": null,
                "points_answer": null,
                "table_answer": null,
                "type": "MCQ"
              }
            ],
            "type_display": "MCQ"
          },
          {
            "id": 140,
            "main_question": 42,
            "name": "C",
            "type": "POINTS_BASED",
            "questions": [
              {
                "id": 69,
                "section": 140,
                "text": "sdf",
                "sequence": 0,
                "marks": 4,
                "options": [],
                "subjective_answer": null,
                "points_answer": null,
                "table_answer": null,
                "type": "POINTS_BASED"
              }
            ],
            "type_display": "Points Based"
          }
        ]
      },
      {
        "id": 43,
        "test": 25,
        "heading": "jkgd",
        "sections": [
          {
            "id": 136,
            "main_question": 43,
            "name": "A",
            "type": "SUBJECTIVE",
            "questions": [
              {
                "id": 66,
                "section": 136,
                "text": "jkgd",
                "sequence": 0,
                "marks": 5,
                "options": [],
                "subjective_answer": null,
                "points_answer": null,
                "table_answer": null,
                "type": "SUBJECTIVE"
              }
            ],
            "type_display": "Subjective"
          },
          {
            "id": 137,
            "main_question": 43,
            "name": "B",
            "type": "SUBJECTIVE",
            "questions": [
              {
                "id": 67,
                "section": 137,
                "text": "jkgd",
                "sequence": 0,
                "marks": 4,
                "options": [],
                "subjective_answer": null,
                "points_answer": null,
                "table_answer": null,
                "type": "SUBJECTIVE"
              }
            ],
            "type_display": "Subjective"
          }
        ]
      },
      {
        "id": 44,
        "test": 25,
        "heading": "ksd",
        "sections": [
          {
            "id": 138,
            "main_question": 44,
            "name": "A",
            "type": "SUBJECTIVE",
            "questions": [
              {
                "id": 68,
                "section": 138,
                "text": "ksd",
                "sequence": 0,
                "marks": 4,
                "options": [],
                "subjective_answer": null,
                "points_answer": null,
                "table_answer": null,
                "type": "SUBJECTIVE"
              }
            ],
            "type_display": "Subjective"
          }
        ]
      }
    ]
  });
  const [answers,setAnswers] =useState( [])
  const [activeQuestion, setActiveQuestion] = useState();
  const [num,setNum] = useState([]);
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(null);

  const setNumArrray = (number) =>{
    num[number] = true;
    setNum([...num]);
  }

useEffect(()=>{
  setIsLoading(true);
   axios.get(`getresult/${routeParams.attemptId}`)
       .then(res => {
         setAnswers(res.data.answer);
               setTest(res.data.data[0]);
         setActiveQuestion(res.data.data[0].main_questions[0]?.id);
         setIsLoading(false);
             })
},[])


  return (
      <>
        {isLoading &&
        <div className='h-screen flex flex-col talign-center'>
          <Typography className='p-24 flex justify-center'><CircularProgress size={16}/>&nbsp;Please wait, Answer-sheet is loading</Typography>
        </div>}
        {!isLoading && <FusePageSimple
            content={
              <Box className=''>
                {
                  test.main_questions.map((main_question, index) => (
                      <Paper
                          className={clsx("shadow-sm p-24 flex flex-col h-screen", main_question.id !== activeQuestion && "hidden")}
                          key={index}>
                        <Box className='flex flex-row space-x-24 justify-end'>
                          <Box><h2><b>Marks </b></h2> <h2 style={{color: "red", fontWeight:"bold"}}>{answers[0]?.out_of_marks}{'/'}{answers[0]?.total}</h2></Box>
                          <Box><h2><b>Score </b></h2> <h2 style={{color: "red", fontWeight:"bold"}}>{answers[0]?.score}{'%'}</h2></Box>
                        </Box>
                        <Typography className='font-semibold'>{main_question.heading}</Typography>
                        <Box className='mb-12 overflow-y-auto'>
                            {/*<Typography className='font-semibold'>{main_question.heading}</Typography>*/}
                          {main_question.sections.map((section, indexNum) => (
                              <Box className='mt-24 ' key={indexNum}>
                                <Typography color='textSecondary' variant='p'><b>Part {section.name}</b>: {section.type}
                                </Typography>
                                {section.questions.map((question, i) => (
                                    <AttemptQuestion activeQuestion={activeQuestion}
                                                     question={question}
                                                     attempt={test.attempt_id}
                                                     indexNum={i}
                                                     setNumArrray={setNumArrray}
                                                     setIsSaving={setIsSaving}
                                                     isSaving={isSaving}
                                                     answers={answers.find((item) => item.question.id === question.id)}
                                                     isTeacher={isTeacher}
                                                     key={i}
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
                          {/*{index === test.main_questions.length - 1 && (*/}
                          {/*  <Button variant={'contained'}*/}
                          {/*          color={"primary"}*/}
                          {/*          onClick={()=>endTest()}*/}
                          {/*          className='bg-red-500 hover:bg-red-700'*/}
                          {/*  >End Test</Button>*/}

                          {/*)}*/}
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
                  {test.main_questions.map((main_question, mainQuestionIndex) => (
                      <div
                          key={mainQuestionIndex}
                          onClick={() => activeQuestion && setActiveQuestion(main_question.id)}
                          className={clsx('m-4 h-32 w-32 bg-white rounded-full border-2 flex items-center justify-center ', activeQuestion && 'cursor-pointer', main_question.id === activeQuestion && "border-blue-500")}>
                        <Typography className='text-md'>{mainQuestionIndex + 1}</Typography></div>
                  ))}
                </Box>
              </Box>
            }
        />}
      </>
  )
}

export default AnswerSheet;


/*
* todo required changes in backend api
* create a table AttemptedTest
* student answer : change option to options(m2m field) update dependencies
* save answer question by question
*
* */