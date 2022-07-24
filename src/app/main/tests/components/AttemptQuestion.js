import React, {useEffect, useState} from 'react';
import {Box, Checkbox, TextField, Typography, Button} from "@mui/material";
import PointsInput from "../../../shared-components/PointsInput";
import _ from "lodash";
import clsx from "clsx";
import axios from "axios";
import SimpleDialog from './SimpleDailog'


const AttemptQuestion = ({question, answers, isTeacher, attempt, activeQuestion, isLastQuestion, submitTest, indexNum, setNumArrray, isSaving, setIsSaving}) => {

    // Answers
    // SUBJECTIVE ANSWER
    const [options, setOptions] = useState([])


    const [correctAnswers, setCorrectAnswers] = React.useState();
    const [open, setOpen] = React.useState(false);


    const getAnswer = (id, type) => {
        axios.get(`getanswer/${id}/${type}`)
            .then(async (res) => {
                await setCorrectAnswers(res?.data?.results);
                handleClickOpen();
            })
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setCorrectAnswers([]);
    };

    const getAnswers = (type) => {
        switch (type) {
            case 'SUBJECTIVE' :
                return [answers?.text];
            break;
            case 'POINTS_BASED' :
                return answers?.points_json;
            break;
            case 'MCQ' :
                return answers?.options?.map((item)=>question.options?.find((elm)=>elm.id === item).text);
            break;
            default : return null;
        }
    }

    return (
        <div className={clsx('flex flex-col  gap-5')}>
            <Box>
                <Typography className='py-4 font-semibold'>{question.text}  <p style={{display: "inline", color:"red"}}>{`(${answers?.marks}/${answers?.question?.marks})`}</p></Typography>
                {question.type === "SUBJECTIVE" && (
                    <TextField value={answers?.text}
                               multiline
                               minRows={3}
                               maxRows={15}
                               className='w-md'
                               disabled
                            //    label='Write answer here'
                               />
                )}
                {question.type === "POINTS_BASED" && (
                    <Box className='w-md'>
                        <PointsInput
                            // setPoints={handlePoints}
                            points={answers?.points_json}
                            disabled={true}/>
                    </Box>
                )}
                {question.type === "MCQ" && (
                    <Box className='w-md flex flex-col space-y-8'>
                        {question.options.map(option => (
                            <Box
                                className={clsx('flex flex-row items-center border py-4 cursor-pointer', _.includes(options, option.id) && 'bg-green-50')}
                                // onClick={() => toggleOption(option.id)}
                            >
                                <Checkbox checked={_.includes(answers?.options, option.id)} disabled/>
                                <Typography>{option.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            <Box className='w-md'>
                <Button 
                // disabled={(answers?.score > 50)}
                        onClick={() => getAnswer(question.id, question.type)} variant={"contained"}
                        color={"success"}
                        size={"small"} c
                        lassName='self-end'>
                    Show Answer
                </Button>
            </Box>
            {open &&
            <SimpleDialog
                selectedValue={{"correctAnswers" : correctAnswers,
                                "filledAnswer" : getAnswers(question.type)}}
                open={open}
                onClose={handleClose}
                result={answers?.score}
                isTeacher={isTeacher}
            />
            }
        </div>
    )

}

export default AttemptQuestion;