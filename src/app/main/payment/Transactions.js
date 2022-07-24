import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import {Box, Chip, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {getTransactions, selectTransactions} from "../../store/transactionsSlice";

const Transactions = () => {
  const dispatch = useDispatch()

  const transactions = useSelector(selectTransactions)
  const [progress, setProgress] = useState(true)

  useEffect(
    ()=>{
      dispatch(getTransactions({}))
        .then(()=>setProgress(false))
    }, []
  )

  console.log(transactions)

  return (
    <Paper className='shadow-sm'>
      {transactions.map((item,index)=>(
        <Box key={index} className='border-b-1 p-24 flex flex-col'>
          <Typography variant='h6'>{item.text}&nbsp;<Chip label='debit' size={"small"}/></Typography>
          <Typography variant='subtitle' color={'textSecondary'}>User : Priyanshu Singh</Typography>
          <Typography variant='subtitle' color={'textSecondary'}>Test Id : 21</Typography>
          <Typography variant='subtitle' color={'textSecondary'}>03 Jan 2021, 03:23pm</Typography>
        </Box>
      ))}
      {progress&&<LinearProgress color='secondary'/>}
      { !progress && transactions.length===0 && <Typography variant='subtitle2' color='textSecondary' className='p-24'>No Transactions Found</Typography>}
    </Paper>
  )
}

export default Transactions;