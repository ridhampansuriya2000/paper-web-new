import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
  Avatar, Chip, Grid,
  Icon, TextField,
  Typography,
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import FusePageSimple from '../../../@fuse/core/FusePageSimple';
import {selectAuthRole, selectIsTeacher} from '../../auth/store/userSlice';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {getChartValues, selectCharts, getChartValuesForStudent} from "../../store/dashboardSlice";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import ListItemIcon from '@mui/material/ListItemIcon';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BarChart from './BarChart';
import LineChart from './Line';
import PaiChart from './PaiChart';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import AttributionIcon from '@mui/icons-material/Attribution';
import { logoutUser } from '../../auth/store/userSlice';


const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const month = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];

  const user = useSelector(({auth}) => auth.user);
  const {bar_chart,line_chart,pie_chart,monthly_new_stu,monthly_total_atp,userData,mothly_total_rn,monthly_totle_teacher_test_bought,
    mothly_total_expand, bar_min_max, line_min_max, pie_min_max} = useSelector((state => selectCharts(state)));

  const {params} = useSelector(({test}) => test?.tests?.all);

  const isTeacher = useSelector(selectIsTeacher)

  const [teacher, setTeacher] = useState(isTeacher ? user.id : null)
  const [search, setSearch] = useState(params?.search ?? "")
  const [dashbordData, setDashboardData] = useState({bar_chart,line_chart,pie_chart,monthly_new_stu,monthly_total_atp,userData,mothly_total_rn});
  const [dateReng, setDateReng] = React.useState([null, null]);
  const [isCurrentMonth,setIsCurrentMonth] = React.useState(true);
  const [dateForCard, setDateForCard] = React.useState([null,null,null,null])

  const handleDashboardData = () =>{
    // const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let barCharArr = (bar_chart ?  bar_chart : [] )?.map((item)=>({...item,"Total Revenue": item.amount, created_at__month : month[item.updated_at__month - 1]}));
    let lineChartArray = (line_chart ?  line_chart : [] )?.map((item)=>({...item,"Total Attempt" : item.attempt, updated_at__month : month[item.updated_at__month - 1]}));
    let pieChartArray = isTeacher ? (pie_chart ?  pie_chart : [] )?.map((item)=>({...item, label : month[item.updated_at__month - 1], y : item.user}))
    : (pie_chart ?  pie_chart : [] )?.map((item)=>({...item, label : month[item.updated_at__month - 1], y : item.amount}));
    setDashboardData((preState)=>({
                                    ...preState,
                                    userData :userData,
                                    bar_chart : barCharArr,
                                    line_chart : lineChartArray,
                                    pie_chart : pieChartArray,
                                    monthly_total_atp : monthly_total_atp,
                                    mothly_total_rn : mothly_total_rn,
                                    monthly_new_stu : monthly_new_stu,
                                    monthly_totle_teacher_test_bought : monthly_totle_teacher_test_bought,
                                    mothly_total_expand : mothly_total_expand,
                                    line_min_max : line_min_max,
                                    pie_min_max : pie_min_max,
                                    bar_min_max : bar_min_max,
                                      }));
  }

  useEffect(async () => {
    await fetchTests()
  }, [search, teacher]);

  useEffect(()=>{
    handleDashboardData();
  },[bar_chart,line_chart,monthly_new_stu,monthly_total_atp,userData,mothly_total_rn])

  const fetchTests = async () => {
    if (!isTeacher) {
     await dispatch(getChartValuesForStudent({params: {...params, teacher, search}}))
    }else if(isTeacher){
      await isTeacher && dispatch(getChartValues({params: {...params, teacher, search}}))
    }
  }

  const getDates = async () =>{
    setIsCurrentMonth(false);
    let startValue = dateReng[0].toISOString().slice(0,10);
    let endValue = dateReng[1].toISOString().slice(0,10);
    setDateForCard([startValue,endValue,dateReng[0],dateReng[1]]);
    if (!isTeacher) {
      await dispatch(getChartValuesForStudent({params: {...params, teacher, search,startValue, endValue}}))
    }else if(isTeacher){
      await isTeacher && dispatch(getChartValues({params: {...params, teacher, search,startValue, endValue}}))
    }
    setDateReng([null,null]);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = async () =>{
    dispatch(logoutUser());
    handleClose();
  }

  const getStartEndDate = React.useCallback(() =>{
    return `(${new Date(dateForCard[2]).getDate()}-${month[new Date(dateForCard[2]).getMonth()]}  to  ${new Date(dateForCard[3]).getDate()}-${month[new Date(dateForCard[3]).getMonth()]}) `
  },[dateForCard[0],dateForCard[1]]);

  if (isTeacher) {
    return (
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          wrapper: 'min-h-0',
        }}
        header={
          <div className='flex items-center p-24 justify-between w-full border-b-1'>
            <div className='flex-1'>

            </div>
            <div>
              <Button
                  id="fade-button"
                  aria-controls={open ? 'fade-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
              >
                {user.name}
                <KeyboardArrowDownIcon/>
              </Button>
              <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                    onClick={()=>{
                      history.push('/settings');
                     handleClose()
                }}>
                <ListItemIcon>
                  <Avatar />
                </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={logOut}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Log Out</MenuItem>
              </Menu>
            </div>

          </div>
        }
        content={
          <div style={{marginTop:'20px', marginLeft: "2em"}} >
            <Box sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
              <div>
                <Typography variant='h4'>DASHBOARD</Typography>
              </div>
              <div>
                <Box sx={{display : 'flex', flexDirection : 'row', gap: '1rem', paddingRight : '2rem'}}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={dateReng[0]}
                        onChange={(newValue) => {
                            setDateReng((preState)=>[newValue,null]);
                        }}
                        renderInput={(params) => <TextField size={"small"}{...params} />}
                    />
                      <Box sx={{fontSize:'20px',display:'flex', alignItems: 'center'}}> to </Box>
                      <DatePicker
                          label="End Date"
                          value={dateReng[1]}
                          disabled={!dateReng[0]}
                          minDate={new Date(dateReng[0]).setDate(new Date(dateReng[0]).getDate() + 1)}
                          onChange={(newValue) => {
                                  setDateReng((preState)=>[preState[0],newValue]);
                          }}
                          renderInput={(params) => <TextField size={"small"}{...params} />}
                      />
                  </LocalizationProvider>
                  <Button variant="contained"
                          endIcon={<SearchIcon />}
                          onClick={getDates}
                          disabled={!dateReng[0] || !dateReng[1]}
                          sx={{borderRadius : '1rem'}}
                  >
                    Search
                  </Button>
                </Box>
              </div>
            </Box>
          <Grid container sx={{marginTop:'20px'}} spacing={2}>
            <Grid item xs={4} sx={{height:'100%'}}>
              <Card sx={{borderRadius:'5px', minHeight : '13rem'}}>
                <CardContent sx={{display: 'flex',flexDirection:'row',gap:'10px'}}>
                  <div>
                    <Avatar alt="Remy Sharp"
                            src={ dashbordData.userData.image ? `https://paperapi.tried.ai.${dashbordData.userData.image}` : ''}                    />
                  </div>
                  <div style={{display:'flex',gap:'17px',flexDirection:'column'}}>
                    <h4>{dashbordData.userData.name}</h4>
                    <div style={{display: 'flex',gap:'25px'}}>
                      <div style={{display: 'flex',gap:'10px',flexDirection:'column'}}>
                        <h6>{dashbordData.userData.type}</h6>
                        <h6>{dashbordData.userData.mobile}</h6>
                      </div>
                      <div style={{display: 'flex',gap:'10px',flexDirection:'column'}}>
                        <h6></h6>
                        <h6></h6>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={2.6}>
              <Card sx={{borderRadius: '5px', minHeight : '13rem'}}>
                <CardContent sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <div style={{display: 'flex', gap: '10px', flexDirection: 'column',}}>
                      <h4>Total revenue {isCurrentMonth ? `(${month[new Date().getMonth()]})` : getStartEndDate()}</h4>
                      <h3>{dashbordData?.mothly_total_rn?.amount__sum}</h3>
                    </div>
                    <div>
                      <div className="blue-round font-l">
                        <Box sx={{fontSize : '20px',fontWeight: 'bolder'}}>
                          ₹
                        </Box>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/*<span className="light-green">+0.90</span>*/}
                    {/*From previous period*/}
                  </div>
                  {/*{dateForCard[0] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'Start Date:  '}</div><div>{dateForCard[0] ?? ''}</div></div>}*/}
                  {/*{dateForCard[1] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'End   Date:  '}</div><div>{dateForCard[1] ?? ''}</div></div>}*/}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={2.6}>
              <Card sx={{borderRadius: '5px', minHeight : '13rem'}}>
                <CardContent sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <div style={{display: 'flex', gap: '10px', flexDirection: 'column',}}>
                      <h4>Total attempts {isCurrentMonth ? `(${month[new Date().getMonth()]})` : getStartEndDate()}</h4>
                      <h3>{dashbordData?.monthly_total_atp}</h3>
                    </div>
                    <div>
                      <div className="tometo-round">
                        <CreateIcon />
                      </div>
                    </div>
                  </div>
                  <div>
                    {/*<span className="light-green">+0.90</span>*/}
                    {/*From previous period*/}
                  </div>
                  {/*{dateForCard[0] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'Start Date:  '}</div><div>{dateForCard[0] ?? ''}</div></div>}*/}
                  {/*{dateForCard[1] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'End   Date:  '}</div><div>{dateForCard[1] ?? ''}</div></div>}*/}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={2.6}>
              <Card sx={{borderRadius: '5px', minHeight : '13rem'}}>
                <CardContent sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <div style={{display: 'flex', gap: '10px', flexDirection: 'column',}}>
                      <h4>New students purchase {isCurrentMonth ? `(${month[new Date().getMonth()]})` : getStartEndDate()}</h4>
                      <h3>{dashbordData?.monthly_new_stu}</h3>
                    </div>
                    <div>
                      <div className="green-round">
                        <AttributionIcon />
                      </div>
                    </div>
                  </div>
                  <div>
                    {/*<span className="light-green">+0.90</span>*/}
                    {/*From previous period*/}
                  </div>
                  {/*{dateForCard[0] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'Start Date:  '}</div><div>{dateForCard[0] ?? ''}</div></div>}*/}
                  {/*{dateForCard[1] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'End   Date:  '}</div><div>{dateForCard[1] ?? ''}</div></div>}*/}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
            <Grid item container sx={{marginTop: '20px'}} spacing={2}>
              <Grid item
                    xs={12} md={12} lg={5} xl={5}
              >
                <Grid
                      sx={{height: '100%', background : "#ffffff",padding : '1rem', borderRadius : '10px',display:'flex', flexDirection: 'column', justifyContent: 'center'}}
                >
                <PaiChart pieChart ={dashbordData.pie_chart} label='Total Student Purchas Per Month'/>
                  <Typography variant="h4" component="div" sx={{display:'flex', justifyContent: 'center'}}>
                    Students
                  </Typography>
                </Grid>
              </Grid>

              <Grid item
                    className='mx-5'
                    xs={12} md={12} lg={5} xl={5}
              >
                <Grid
                      sx={{height: '100%',  background : "#ffffff",padding : '1rem', borderRadius : '10px',display:'flex', flexDirection: 'column', justifyContent: 'center'}}
                >
                {/*<Card sx={{borderRadius: '5px'}}>*/}
                  <LineChart
                      line_chart={dashbordData.line_chart}
                      line_min_max={dashbordData.line_min_max}
                      label=''
                  />
                  <Typography variant="h4" component="div" sx={{display:'flex', justifyContent: 'center'}}>
                    Attempts
                  </Typography>
                {/*</Card>*/}
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{marginTop: '20px'}}>
              <Grid item
                    // className='mx-5'
                    xs={12} md={12} lg={12} xl={12}
                    sx={{height: '100%',  background : "#ffffff", borderRadius : '10px',display:'flex', flexDirection: 'column', justifyContent: 'center'}}
              >
                <BarChart
                    bar_chart={dashbordData.bar_chart}
                    bar_min_max={dashbordData.bar_min_max}
                    label=''
                />
                <Typography variant="h4" component="div" sx={{display:'flex', justifyContent: 'center'}}>
                  Revenue generated
                </Typography>
              </Grid>


              {/*<Grid item xs={12} md={12} lg={5} xl={5} sx={{height: '100%'}}>*/}
              {/*  /!*<Card sx={{borderRadius: '5px'}}>*!/*/}
              {/*  <LineChart line_chart={dashbordData.line_chart}/>*/}
              {/*  /!*</Card>*!/*/}
              {/*</Grid>*/}
            </Grid>
          </div>}
        innerScroll
      />
    );

  } else {
    return (
        <FusePageSimple
            classes={{
              contentWrapper: 'p-0 sm:p-24 h-full',
              content: 'flex flex-col h-full',
              wrapper: 'min-h-0',
            }}
            header={
              <div className='flex items-center p-24 justify-between w-full border-b-1'>

                <div className='flex-1'>

                </div>
                <div>
                  <Button
                      id="fade-button"
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                  >
                    {user.name}
                    <KeyboardArrowDownIcon/>
                  </Button>
                  <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                        onClick={()=>{
                          history.push('/settings');
                          handleClose()
                        }}>
                      <ListItemIcon>
                        <Avatar />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Log Out</MenuItem>
                  </Menu>
                </div>

              </div>
            }
            content={
              <div style={{marginTop:'20px', marginLeft: "2em"}} >
                <Box sx={{ display : 'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
                  <div>
                    <Typography variant='h4'>DASHBOARD</Typography>
                  </div>
                  <div>
                    <Box sx={{display : 'flex', flexDirection : 'row', gap: '1rem', paddingRight : '2rem'}}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                              label="Start Date"
                              value={dateReng[0]}
                              onChange={(newValue) => {
                                  setDateReng((preState)=>[newValue,null]);
                              }}
                              renderInput={(params) => <TextField size={"small"}{...params} />}
                          />
                          <Box sx={{fontSize:'20px',display:'flex', alignItems: 'center'}}> to </Box>
                          <DatePicker
                              label="End Date"
                              value={dateReng[1]}
                              disabled={!dateReng[0]}
                              minDate={new Date(dateReng[0]).setDate(new Date(dateReng[0]).getDate() + 1)}
                              onChange={(newValue) => {
                                  setDateReng((preState)=>[preState[0],newValue]);
                              }}
                              renderInput={(params) => <TextField size={"small"}{...params} />}
                          />
                      </LocalizationProvider>
                      <Button variant="contained"
                              endIcon={<SearchIcon />}
                              onClick={getDates}
                              disabled={!dateReng[0] || !dateReng[1]}
                              sx={{borderRadius : '1rem'}}
                      >
                        Search
                      </Button>
                    </Box>
                  </div>
                </Box>
                <Grid container sx={{marginTop:'20px'}} spacing={2}>
                  <Grid item xs={4} sx={{height:'100%'}}>
                    <Card sx={{borderRadius:'5px', minHeight : '13rem'}}>
                      <CardContent sx={{display: 'flex',flexDirection:'row',gap:'10px'}}>
                        <div>
                          <Avatar alt="Remy Sharp"
                                  src={ dashbordData.userData.image ? `https://paperapi.tried.ai.${dashbordData.userData.image}` : ''}
                          />
                        </div>
                        <div style={{display:'flex',gap:'17px',flexDirection:'column'}}>
                          <h4>{dashbordData.userData.name}</h4>
                          <div style={{display: 'flex',gap:'25px'}}>
                            <div style={{display: 'flex',gap:'10px',flexDirection:'column'}}>
                              <h6>{dashbordData.userData.type}</h6>
                              <h6>{dashbordData.userData.mobile}</h6>
                            </div>
                            <div style={{display: 'flex',gap:'10px',flexDirection:'column'}}>
                              <h6></h6>
                              <h6></h6>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={2.6}>
                    <Card sx={{borderRadius: '5px', minHeight : '13rem'}}>
                      <CardContent sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}>
                          <div style={{display: 'flex', gap: '10px', flexDirection: 'column',}}>
                            <h4>Monthly Total Expenditure {isCurrentMonth ? `(${month[new Date().getMonth()]})` : getStartEndDate()}</h4>
                            <h3>{dashbordData?.mothly_total_expand?.amount__sum}</h3>
                          </div>
                          <div>
                            <div className="blue-round">
                              <Box sx={{fontSize : '20px',fontWeight: 'bolder'}}>
                              ₹
                            </Box>
                            </div>
                          </div>
                        </div>
                        <div>
                          {/*<span className="light-green">+0.90</span>*/}
                          {/*From previous period*/}
                        </div>
                        {/*{dateForCard[0] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'Start Date:  '}</div><div>{dateForCard[0] ?? ''}</div></div>}*/}
                        {/*{dateForCard[1] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'End   Date:  '}</div><div>{dateForCard[1] ?? ''}</div></div>}*/}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={2.6}>
                    <Card sx={{borderRadius: '5px', minHeight : '13rem'}}>
                      <CardContent sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}>
                          <div style={{display: 'flex', gap: '10px', flexDirection: 'column',}}>
                            <h4>Total Attempted {isCurrentMonth ? `(${month[new Date().getMonth()]})` : getStartEndDate()}</h4>
                            <h3>{dashbordData?.monthly_total_atp}</h3>
                          </div>
                          <div>
                            <div className="tometo-round">
                              <CreateIcon />
                            </div>
                          </div>
                        </div>
                        <div>
                        </div>
                        {/*{dateForCard[0] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'Start Date:  '}</div><div>{dateForCard[0] ?? ''}</div></div>}*/}
                        {/*{dateForCard[1] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'End   Date:  '}</div><div>{dateForCard[1] ?? ''}</div></div>}*/}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={2.6}>
                    <Card sx={{borderRadius: '5px', minHeight : '13rem'}}>
                      <CardContent sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}>
                          <div style={{display: 'flex', gap: '10px', flexDirection: 'column',}}>
                            <h4>Monthly Total Teacher Test Bought {isCurrentMonth ? `(${month[new Date().getMonth()]})` : getStartEndDate()}</h4>
                            <h3>{dashbordData?.monthly_totle_teacher_test_bought}</h3>
                          </div>
                          <div>
                            <div className="green-round">
                              <AttributionIcon />
                            </div>
                          </div>
                        </div>
                        <div>
                        </div>
                        {/*{dateForCard[0] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'Start Date:  '}</div><div>{dateForCard[0] ?? ''}</div></div>}*/}
                        {/*{dateForCard[1] && <div style={{display:'flex', flexDirection:'row', fontSize:'14px'}}><div>{'End   DateDate:  '}</div><div>{dateForCard[1] ?? ''}</div></div>}*/}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item container sx={{marginTop: '20px'}} spacing={2}>
                  <Grid item
                        xs={12} md={12} lg={5} xl={5}
                  >
                    <Grid
                        sx={{height: '100%', background : "#ffffff",padding : '1rem', borderRadius : '10px'}}
                    >
                      <PaiChart pieChart ={dashbordData.pie_chart}/>
                      <Typography variant="h4" component="div" sx={{display:'flex', justifyContent: 'center'}}>
                        Expenditure
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item
                        className='mx-5'
                        xs={12} md={12} lg={5} xl={5}
                  >
                    <Grid
                        sx={{height: '100%',  background : "#ffffff",padding : '1rem', borderRadius : '10px'}}
                    >
                      <LineChart line_chart={dashbordData.line_chart}
                                 line_min_max={dashbordData.line_min_max}
                                 label=''
                      />
                      <Typography variant="h4" component="div" sx={{display:'flex', justifyContent: 'center'}}>
                        Attempts
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </div>}
            innerScroll
        />
    );
  }
};

export default Dashboard;
