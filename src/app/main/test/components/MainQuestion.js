import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Paper from "@mui/material/Paper";
import {
    Button,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    Icon,
    InputAdornment,
    LinearProgress,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Check, DeleteOutline} from "@mui/icons-material";
import Section from "./Section";
import {deleteMainQuestion, updateMainQuestion} from "../../../store/test/mainQuestionsSlice";
import {useDispatch} from "react-redux";
import {createSection} from "../../../store/test/sectionsSlice";

const MainQuestion = ({mainQuestion,getTest}) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [heading, setHeading] = useState(mainQuestion?.heading);
    const [newSectionType, setNewSectionType] = useState('SUBJECTIVE')

    const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false)

    const [progressAddSection, setProgressAddSection] = useState(false)

    useEffect(() => {
        setHeading(mainQuestion?.heading)
    }, [mainQuestion])

    const handleUpdateQuestion = () => {
        dispatch(updateMainQuestion({id: mainQuestion?.id, heading}))
    }

    const handleDeleteQuestion = () => {
        dispatch(deleteMainQuestion(mainQuestion?.id))
            .then(()=>{
                setDeleteConfirmationDialog(false)
            })

    }

    const handleAddSection = () => {
        setProgressAddSection(true)
        dispatch(createSection({type: newSectionType, main_question:mainQuestion?.id}))
            .then(()=>setProgressAddSection(false))
    }

    const handleEndTest = () =>{
        history.push("/dashboard");
    }

    if(!mainQuestion) return null;

    return (
        <div className='flex flex-col p-24 relative'>
            <TextField
                value={heading}
                className='text-20'
                inputProps={{style: {fontSize: 18}}}
                multiline
                label='Question'
                maxRows={10}
                onChange={(e) => setHeading(e.target.value)}
                InputProps={{ // <-- This is where the toggle button is added.
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                hidden={heading === mainQuestion.heading}
                                aria-label="toggle password visibility"
                                className='bg-blue-400 hover:bg-blue-500'
                                onClick={handleUpdateQuestion}
                                // onMouseDown={handleMouseDownPassword}
                            >
                                {<Check color='#fff'/>}
                            </IconButton>
                        </InputAdornment>
                    )
                }}

            />
            <IconButton onClick={()=>setDeleteConfirmationDialog(true)} title='Delete Question' color={"primary"} className='absolute -right-10 -top-10 bg-white border'><DeleteOutline/></IconButton>
            <div className='pt-24'/>
            {_.compact(mainQuestion?.sections??[]).map(section => (
                section && <Section section={section} getTest={getTest}/>
            ))}
            {!!_.compact(mainQuestion?.sections??[]).length ||
            <Typography color={"textSecondary"} className='flex flex-row items-center'>
                <Icon className='text-14 mr-4' color={"textSecondary"}>info</Icon>
                No Question Parts</Typography>}
            <div className='flex flex-row pt-24 space-x-12 justify-between'>
               <div className='flex flex-row space-x-12 '>
                   <TextField value={newSectionType}
                              onChange={e => setNewSectionType(e.target.value)}
                              select
                              size={"small"}>
                       <MenuItem value='SUBJECTIVE'>Subjective</MenuItem>
                       <MenuItem value='POINTS_BASED'>Points Based</MenuItem>
                       {/*<MenuItem value='TABLE_BASED'>Table Based</MenuItem>*/}
                       <MenuItem value='MCQ'>MCQs</MenuItem>
                   </TextField>
                   <Button color='secondary' variant='outlined' onClick={handleAddSection}>Add Part &nbsp; {progressAddSection && <CircularProgress disableShrink size={12}/>}</Button>
               </div>
                <div>
                    <Button variant="contained" color="success"  onClick={handleEndTest}>
                        End Test
                    </Button>

                </div>
            </div>

            <Dialog open={deleteConfirmationDialog}>
                <DialogTitle>Do you want to delete this question?</DialogTitle>
                <DialogContent>On this actions, all answers/sub-questions will be deleted.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationDialog(false)}>No</Button>
                    <Button variant='contained' color={'primary'} onClick={handleDeleteQuestion}>Yes Delete</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default MainQuestion;