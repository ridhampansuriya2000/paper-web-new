import React, {useEffect, useState} from 'react';
import {Box, Checkbox, TextField, Typography} from "@mui/material";
import PointsInput from "../../../shared-components/PointsInput";
import _ from "lodash";
import clsx from "clsx";
import axios from "axios";


const AttemptQuestion = ({question, attempt, activeQuestion, isLastQuestion, submitTest, indexNum, setNumArrray, isSaving,setIsSaving}) => {

  // Answers
  // SUBJECTIVE ANSWER
  const [subjectiveAnswer, setSubjectiveAnswer] = useState('')
  const [options, setOptions] = useState([])
  const [points, setPoints] = useState([''])
  const [isSavingPending, setIsSavingPending] = useState(false)

  const submitAnswer = () => {
    const fd = new FormData()
    fd.append('attempt', attempt)
    fd.append('question', question.id)
    question.type === "SUBJECTIVE" && fd.append('text', subjectiveAnswer)
    // question.type === "POINTS_BASED" && fd.append('points_json', JSON.stringify(points))
    question.type === "POINTS_BASED" && fd.append('points_json', JSON.stringify(points.filter((item) => item != "")?.length > 0 ? points.filter((item)=> item != "") : [""]))
    question.type === "MCQ" && fd.append('options', JSON.stringify(options))
    fd.append('text', subjectiveAnswer);
    axios.post('answers/',fd);
    setIsSavingPending(false);
  }
  console.log(subjectiveAnswer, options, points);

  useEffect(async () => {
      if(isSaving){
          await submitAnswer();
      }
    if (isLastQuestion) {
          setNumArrray(indexNum);
        // submitTest()
    }
    // else if(isSavingPending){
    //     await submitAnswer();
    // }

  }, [activeQuestion,isLastQuestion]);

  const handleSubjectiveAnswer = (e) => {
    setIsSavingPending(true)
    setSubjectiveAnswer(e.target.value)
  }

  const handlePoints = (points) => {
    setIsSavingPending(true)
    setPoints(points)
  }

  const toggleOption = (option) => {
    if (_.includes(options, option)) {
      setOptions(options.filter(item => item !== option))
      return
    }
    setOptions(_.union(options, [option]))
    setIsSavingPending(true)
  }

  return (
    <Box>
      <Typography className='py-4 font-semibold'>{question.text}</Typography>
      {question.type === "SUBJECTIVE" && (
        <TextField value={subjectiveAnswer}
                   onChange={handleSubjectiveAnswer}
                   multiline
                   minRows={3}
                   maxRows={15}
                   className='w-md'
                   label='Write answer here'/>
      )}
      {question.type === "POINTS_BASED" && (
        <Box className='w-md'>
          <PointsInput points={points} setPoints={handlePoints}/>
        </Box>
      )}
      {question.type === "MCQ" && (
        <Box className='w-md flex flex-col space-y-8'>
          {question.options.map(option => (
            <Box className={clsx('flex flex-row items-center border py-4 cursor-pointer', _.includes(options, option.id) && 'bg-green-50')}
                 onClick={() => toggleOption(option.id)}>
              <Checkbox checked={_.includes(options, option.id)}/>
              <Typography>{option.text}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>

  )

}

export default AttemptQuestion;