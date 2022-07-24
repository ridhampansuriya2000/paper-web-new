import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import {
  Box,
  Button, Checkbox,
  Chip, CircularProgress,
  Icon, IconButton,
  MenuItem,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import _ from "lodash";
import Question from "./Question";
import {createQuestion} from "../../../store/test/questionsSlice";
import {useDispatch} from "react-redux";
import {DeleteOutline} from "@mui/icons-material";
import {deleteSection} from "../../../store/test/sectionsSlice";


const Section = ({section,getTest}) => {
  // console.log(section)
  const dispatch = useDispatch()
  const [questions, setQuestions] = useState([])

  // for new question create
  const [text, setText] = useState("");
  const [marks, setMarks] = useState("");
  const [subjectiveAnswer, setSubjectiveAnswer] = useState("");
  const [points, setPoints] = useState(['']);
  const [options, setOptions] = useState([]);

  const [progressAddQuestion, setProgressAddQuestion] = useState(false);

  const handelResetQuetionData = () =>{
    setText('');
    setMarks('');
    setSubjectiveAnswer('');
    setPoints(['']);
    setOptions([]);
  }
  const handleDeleteSection = async () => {
    await dispatch(deleteSection(section.id));
    getTest();
  }

  const handleAddQuestion = () => {
    setProgressAddQuestion(true)
    if (section.type === "SUBJECTIVE") {
      dispatch(createQuestion({section: section.id, text: text ? text : section.main_outer_qutions, subjective_answer: subjectiveAnswer, marks}))
        .then(() => setProgressAddQuestion(false))
    } else if (section.type === "POINTS_BASED") {
      dispatch(createQuestion({section: section.id, text:  text ? text : section.main_outer_qutions, points_json: JSON.stringify(points), marks}))
        .then(() => setProgressAddQuestion(false))
    } else if (section.type === "MCQ") {
      dispatch(createQuestion({section: section.id, text:  text ? text : section.main_outer_qutions, options_json: JSON.stringify(options), marks}))
        .then(() => setProgressAddQuestion(false))
    }
    handelResetQuetionData();
  }

  const isAllFilledValidate = (type) =>{
    switch (type) {
      case  "SUBJECTIVE" :
        if(subjectiveAnswer !== '' && subjectiveAnswer !== undefined){
          return true
        }
        else {
          return false;
        }
        // eslint-disable-next-line no-unreachable
        break;
      case "POINTS_BASED" :
         if(points?.length > 0 && points.some((item)=> item === '')){
            return false
          }else {
           return true;
         }
        // eslint-disable-next-line no-unreachable
         break;
      case "MCQ" :
        if(options?.length > 0 && options?.every((item)=> item.text !== "") && options?.some((elm)=> elm?.is_correct === true)){
          return true
        }else{
          return false
        }
        // eslint-disable-next-line no-unreachable
        break;
      default : return false;
    }
  }

  useEffect(() => {
    if (section?.questions?.length > 0) {
      if (_.includes(['SUBJECTIVE', 'POINTS_BASED', 'TABLE_BASED'], section.type)) {
        setQuestions([section.questions[0]])
        // console.log(section.questions[0])
      } else setQuestions(section.questions)
    }
  }, [section.questions])

  const addOrUpdatePoint = (text, index = undefined) => {
    if (index !== undefined) {
      setPoints(points.map((text_, i) => {
          if (i === index) return text
          else return text_
        }
      ))
    } else {
      setPoints(points.concat(""))
    }
  }
  const removePoint = (index) => {
    setPoints(points.filter((text_, i) => i !== index))
  }

  const addOrUpdateOption = (option, index = undefined) => {
    if (index !== undefined) {
      setOptions(options.map((optionx, i) => {
          if (i === index) return {...optionx, ...option}
          else return optionx
        }
      ))
    } else {
      setOptions(options.concat({text: '', is_correct: false}))
    }
  }
  const removeOption = (index) => {
    setOptions(options.filter((text_, i) => i !== index))
  }


  return (
    <Box className='flex flex-col p-24 -mx-24 border-2 border-white hover:border-blue-500'>
      <div className='space-x-12 flex flex-row items-center mb-12'>
        <Typography variant='h6'>{"Part " + section.name}
        </Typography>
        <Chip variant={"outlined"}
              color={"primary"}
              size={"small"}
              label={section.type_display}/>
        <IconButton onClick={handleDeleteSection} color='primary'><DeleteOutline/></IconButton>

      </div>

      {_.compact(questions).map(question =>
        question && <Question question={question}/>
      )}

      {/*{(_.compact(questions).length === 0 && section.type === "MCQ") && (*/}
      {(_.compact(questions).length === 0) && (
        <Box flexDirection={"column"} className='space-y-12 w-full'>
          <TextField
            multiline maxRows={4} label='Sub question (Optional)'
            inputProps={{style: {fontSize: 16}}}
            onChange={e => setText(e.target.value)}
            value={text}
            className='w-lg'
          />
          <Box flexDirection={"row"} gap={4}>
            <TextField
              label='Marks'
              size={"small"}
              inputProps={{style: {fontSize: 16}}}
              className='max-w-xs w-128'
              value={marks}
              onChange={e => setMarks(e.target.value)}
            />
          </Box>

          {section.type === "SUBJECTIVE" && (
            <Box className='flex flex-col'>
              <TextField multiline maxRows={10} minRows={3} label='Write subjective answer'
                         value={subjectiveAnswer}
                         className='w-lg'
                         onChange={e => setSubjectiveAnswer(e.target.value)}
              />
            </Box>
          )}
          {section.type === "POINTS_BASED" && (
            <Box className='space-y-12 pr-128'>
              {points.map((item, index) =>
                <div className="w-full flex flex-row space-x-12">
                  <TextField value={item}
                             onChange={e => addOrUpdatePoint(e.target.value, index)}
                             size={"small"}
                             className='flex-1'
                             label='Write text here'/>
                  <IconButton onClick={() => removePoint(index)}>
                    <DeleteOutline/>
                  </IconButton>
                </div>
              )}
              <Button variant={"outlined"} className='self-start' onClick={() => addOrUpdatePoint("")}>Add
                point</Button>
            </Box>
          )}
          {section.type === "MCQ" && (
            <Box className='flex flex-col space-y-12'>
              {options.map((option, index) =>
                <div className="w-full flex flex-row space-x-12">
                  <Checkbox value={option.is_correct}
                            onChange={e => addOrUpdateOption({is_correct: e.target.checked}, index)}/>
                  <TextField value={option.text}
                             onChange={e => addOrUpdateOption({text: e.target.value}, index)}
                             size={"small"}
                             className='flex-1'
                             label='Write text here'/>
                  <IconButton onClick={() => removeOption(index)}>
                    <DeleteOutline/>
                  </IconButton>
                </div>
              )}
              <Button variant={"outlined"} className='self-start' onClick={addOrUpdateOption}>Add
                option</Button>
            </Box>
          )}

          <Button onClick={handleAddQuestion}
                  disabled={!isAllFilledValidate(section.type)}
                  variant={"contained"}
                  color={"primary"}
                  size={"small"}
                  className='self-end'>Add
            Answer &nbsp; {progressAddQuestion &&
            <CircularProgress color={"secondary"} disableShrink size={12}/>}</Button>
        </Box>
      )}

    </Box>
  )
}
export default Section;