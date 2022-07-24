import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import {
    Box,
    Button, Checkbox,
    Chip,
    Icon, IconButton,
    MenuItem,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {DeleteOutline} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {deleteQuestion, updateQuestion} from "../../../store/test/questionsSlice";


const Question = ({question}) => {
    // console.log(question)
    const dispatch = useDispatch()
    const [text, setText] = useState('');
    const [marks, setMarks] = useState('');
    const [subjectiveAnswer, setSubjectiveAnswer] = useState('');
    const [points, setPoints] = useState([])
    const [options, setOptions] = useState([]);

    useEffect(()=>{
        setText(question.text)
        setMarks(question.marks)
        setSubjectiveAnswer(question.subjective_answer)
        setPoints(question.points_answer)
        setOptions(question.options)
    }, [question.id])

    const handleUpdateQuestion = () => {
        dispatch(updateQuestion({
            id: question.id,
            subjective_answer: subjectiveAnswer,
            points_json: points,
            options_json: options,
            text,
            marks
        }))
    }

    const handleDeleteQuestion = () => {
        dispatch(deleteQuestion(question.id))
    }

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

    const addOrUpdateOption = (option, index=undefined) => {
        if (index !== undefined){
            setOptions(options.map((optionx, i) => {
                    if (i === index) return {...optionx, ...option}
                    else return optionx
                }
            ))
        } else {
            setOptions(options.concat({text:'', is_correct:false}))
        }
    }
    const removeOption = (index) => {
        setOptions(options.filter((text_, i) => i !== index))
    }


    const updateTableCell = (row, column, text) => {

    }

    const hasChanged = () => {
        return true
    }

    return (
        <div className='flex flex-col space-y-12 pb-24'>

            <TextField
                multiline maxRows={4} label='Sub question (Optional)'
                inputProps={{style: {fontSize: 16}}}

                value={text}
                onChange={e => setText(e.target.value)}

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

            {question.type === "SUBJECTIVE" && (
                <Box className='flex flex-col w-full'>
                    <TextField value={subjectiveAnswer}
                               onChange={e => setSubjectiveAnswer(e.target.value)}
                               multiline
                               maxRows={10}
                               minRows={3}
                               label='Write subjective answer'/>
                </Box>
            )}
            {question.type === "POINTS_BASED" && (
                <Box className='space-y-12 pr-128'>
                    {points?.map((item, index) =>
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
            {question.type === "MCQ" && (
                <Box className='flex flex-col space-y-12'>
                    {options.map((option, index) =>
                        <div className="w-full flex flex-row space-x-12">
                            <Checkbox checked={option.is_correct} onChange={e=>addOrUpdateOption({is_correct:e.target.checked}, index)}/>
                            <TextField value={option.text}
                                       onChange={e => addOrUpdateOption({text:e.target.value}, index)}
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
            <div className='flex flex-row space-x-12'>
                <Button onClick={handleDeleteQuestion}
                        variant={"outlined"}
                        color={"primary"}
                        size={"small"}
                        className='self-end'>Delete Answer</Button>
                <Button disabled={!hasChanged}
                        onClick={handleUpdateQuestion}
                        variant={"contained"}
                        color={"primary"}
                        size={"small"}
                        className='self-end'>Save</Button>
            </div>

            {question.type === "MCQ" && (
                <div className='border-b-1 pb-24'/>
            )}
        </div>
    )
}

export default Question;