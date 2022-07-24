import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {
    Box,
    Button,
    Icon,
    MobileStepper,
    TextField,
    Typography
} from "@mui/material";
import {motion} from "framer-motion";
import Paper from "@mui/material/Paper";
import {getTest, selectTest} from "../../store/test/testsSlice";
import MainQuestion from "./components/MainQuestion";
import {getCourses, selectCourses} from "../../store/coursesSlice";
import MenuItem from "@mui/material/MenuItem";
import EditTestDetails from "./components/EditTestDetails";
import {useParams} from "react-router-dom";
import Divider from "@mui/material/Divider";
import {ArrowBack, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import {createMainQuestion} from "../../store/test/mainQuestionsSlice";
import {Skeleton} from "@mui/lab";
import IconButton from "@mui/material/IconButton";
import history from '@history';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {showMessage} from 'app/store/fuse/messageSlice';
import {deleteTest, publishTest} from "../../store/test/testsSlice";

const ManageTest = () => {
    const dispatch = useDispatch();
    const routeParams = useParams();
    const test = useSelector((state) => selectTest(state, routeParams.id))
    const [progress, setProgress] = useState(true)

    const [tabValue, setTabValue] = useState(1);

    useEffect(() => {
        routeParams.id && dispatch(getTest({id: routeParams.id})).then(() => setProgress(false))
        dispatch(getCourses())
    }, [])

    const getTestFun = () =>{
        routeParams.id && dispatch(getTest({id: routeParams.id})).then(() => setProgress(false));
    }


    const [steps, setSteps] = useState(test?.main_questions ?? [])
    const [activeStep, setActiveStep] = useState(0)

    const [mainQuestionHeading, setMainQuestionHeading] = useState("")

    const isVelidated = () =>{
        return steps[activeStep]?.sections?.some((item)=> item.questions?.length === 0);
    }

    const hanldeDelete = async () =>{
       await dispatch(deleteTest(routeParams.id));
       history.push("/dashboard")
    }

    const handlePubish = async () =>{
        const res = await dispatch(publishTest({ id : routeParams.id, publish :test.publish ? "False" : "True"}));
        if(res?.payload?.data?.status === 200){
            getTestFun();
        }
    }

    useEffect(()=>{
        isVelidated();
    },[steps[activeStep]?.sections]);
    // useEffect(() => {
    //     setSteps(_.compact(test?.main_questions??[]).concat([undefined]))
    // }, [test?.main_questions])

    useEffect(async () => {
        // routeParams.id && await dispatch(getTest({id: routeParams.id})).then(() => setProgress(false));
        // await setSteps([]);
        setSteps(_.compact(test?.main_questions??[]).concat([undefined]).map((item,index)=>{
            console.log(`-------${index}------>`,item);
            if(item !== undefined && item?.id){
                let array = item?.sections?.map((elm)=>{
                    return {...elm,
                        main_outer_qutions : item.heading}
                }).filter((obj)=> obj.id && obj !== undefined);
                return {...item,
                sections : array}
           }else return item
        }).filter((obj)=> obj !== undefined))
    }, [test?.main_questions]);

    const handleCreateMainQuestion = () => {
        dispatch(createMainQuestion({heading: mainQuestionHeading, test: test.id})).then(()=>{
            setMainQuestionHeading("")
        })
    }

    if (!routeParams.id) {
        return <FusePageSimple
            header={
                <div className='flex items-center p-24 justify-between w-full border-b-1 bg-white'>
                    <Typography
                        component={motion.span}
                        initial={{x: -20}}
                        animate={{x: 0, transition: {delay: 0.2}}}
                        delay={300}
                        className='hidden sm:flex text-16 md:text-24 mx-12'
                        color={'primary'}
                    >
                        Create new Test
                    </Typography>
                    <div className='flex-1'>

                    </div>
                    <div className='flex flex-col'>
                        <Typography variant='h4'>Paper</Typography>
                        <Typography>By TRIEd</Typography>
                    </div>
                </div>
            }

            content={
                <div className='p-24'>
                    <EditTestDetails test={test} isCreatMode={true}/>
                </div>
            }

        />
    }

    if (!test || progress) {

        return <FusePageSimple

            header={
                <div className='flex items-center p-24 w-full border-b-1 bg-white'>
                    <IconButton onClick={() => history.goBack()}
                                color={"primary"}><Icon>keyboard_backspace</Icon></IconButton>
                    <Typography
                        component={motion.span}
                        initial={{x: -20}}
                        animate={{x: 0, transition: {delay: 0.2}}}
                        delay={300}
                        className='hidden sm:flex text-20 mx-12'
                        color={'primary'}
                    >
                        Manage Test - Loading
                    </Typography>
                </div>
            }

            content={
                <div className='p-24'>
                    <Skeleton animation={"wave"} variant="rectangular" width={'100%'} height={200} className='mb-24'/>
                    <Skeleton animation={"wave"} variant="rectangular" width={'100%'} height={400}/>
                </div>}
        />
    }

    return (
        <FusePageSimple

            header={
                <div className='flex items-center p-24 w-full border-b-1 bg-white'>
                    <IconButton onClick={() => history.goBack()}
                                color={"primary"}><Icon>keyboard_backspace</Icon></IconButton>
                    <Typography
                        component={motion.span}
                        initial={{x: -20}}
                        animate={{x: 0, transition: {delay: 0.2}}}
                        delay={300}
                        className='hidden sm:flex text-20 mx-12'
                        color={'primary'}
                    >
                        Manage Test - {test.name}
                    </Typography>
                </div>
            }

            content={
                <div className='px-24'>

                    <Tabs
                        value={tabValue}
                        onChange={(e, value) => setTabValue(value)}
                        indicatorColor='secondary'
                        textColor='secondary'
                        variant='scrollable'
                        // className='h-48'
                    >
                        <Tab className='text-14 normal-case' label='Test Details'/>
                        <Tab className='text-14 normal-case' label='Questions'/>
                        <Tab className='text-14 normal-case' label='Settings'/>
                    </Tabs>


                    {tabValue === 0 && <div className='pt-12'><EditTestDetails test={test}/></div>}

                    {tabValue === 1 && <div className='pt-12'>
                        <Paper className='shadow p-4'>
                            {steps?.[activeStep]?.id ? <MainQuestion mainQuestion={steps?.[activeStep]} getTest={getTestFun}/>
                            :
                                <Box className='p-24 space-y-12'>
                                    <Typography variant='h5'>
                                        Add New Question</Typography>
                                    <div className='flex flex-row space-x-12'>
                                        <TextField value={mainQuestionHeading}
                                                   inputProps={{style: {fontSize: 18}}}
                                                   onChange={e => setMainQuestionHeading(e.target.value)}
                                                   className='w-sm'
                                                   label='Write question heading...'/>
                                        <Button variant={"outlined"} onClick={handleCreateMainQuestion}> + Add
                                            Question</Button>
                                    </div>
                                </Box>

                            }
                        </Paper>

                        <MobileStepper
                            variant="dots"
                            steps={steps.length}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                                <Button size="small"
                                        onClick={() => {
                                            if(!isVelidated())
                                            activeStep <= steps.length - 1 && setActiveStep(activeStep + 1)
                                            else {
                                                dispatch(showMessage({
                                                    message: "Please fill all details and save it",
                                                    variant: 'error'
                                                }))
                                            }
                                        }}
                                        // disabled={activeStep === steps.length - 1}
                                    disabled={steps[activeStep]?.sections?.length === 0 }
                                >
                                    Next Question <KeyboardArrowRight/>
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                                        disabled={activeStep === 0}>
                                    <KeyboardArrowLeft/> Previous Question
                                </Button>
                            }
                        />
                    </div>}

                    {tabValue === 2 && <div className='pt-12'>
                        <Paper className='shadow flex flex-col space-y-12'>
                            <div className='flex flex-row p-24 items-center'>
                                <Typography className='w-320 flex flex-row'>Status • &nbsp;<Typography color={'textSecondary'}>Draft</Typography></Typography>
                                <Button variant={"outlined"} onClick={()=>handlePubish()}>{test.publish ? "UnPublish" : "Publish"}</Button>
                            </div>
                            <div className='flex flex-row p-24 items-center'>
                                <Typography className='w-320'>More Actions</Typography>
                                <Button variant={"outlined"} onClick={()=>hanldeDelete()}>Delete Test</Button>
                            </div>

                        </Paper>
                    </div>}


                </div>
            }

        />

    )
}

export default ManageTest