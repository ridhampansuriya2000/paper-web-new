import React, {useState} from "react";
import Paper from "@mui/material/Paper";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../auth/store/userSlice";

const BankDetails = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.auth)

  const [name, setName] = useState(user.bank_details?.name ?? '')
  const [accountHolderName, setAccountHolderName] = useState(user.bank_details?.account_holder_name ?? '')
  const [accountNumber, setAccountNumber] = useState(user.bank_details?.account_number ?? '')
  const [ifscCode, setIfscCode] = useState(user.bank_details?.ifsc_code ?? '')

  const [progress, setProgress] = useState(false)

  const handleSubmit = () => {
    setProgress(true)
    dispatch(updateUser({
      bank_details: JSON.stringify({
        name,
        account_holder_name: accountHolderName,
        account_number: accountNumber,
        ifsc_code: ifscCode
      })
    }))
      .then(() => setProgress(false))
  }

  const canSubmit = () => {
    if(progress) return false;
    if(name==='') return false;
    if(accountHolderName==='') return false;
    if(accountNumber==='') return false;
    if(ifscCode==='') return false;
    return true
  }

  return (
    <Paper className='shadow-sm px-24 py-12 self-start'>
      <Typography variant='h5'>Bank Details</Typography>
      <Typography variant={"subtitle1"} color='textSecondary'>Enter Bank Details for Payout/Withdrawals</Typography>
      <Box className='space-y-12 pt-24 flex flex-col'>
        <TextField value={name}
                   onChange={e => setName(e.target.value)}
                   label='Bank Name'
                   variant={"filled"}
                   className='w-xs'/>
        <TextField value={accountHolderName}
                   onChange={e => setAccountHolderName(e.target.value)}
                   label='Account Holder Name'
                   variant={"filled"}
                   className='w-xs'/>
        <TextField value={accountNumber}
                   onChange={e => setAccountNumber(e.target.value)}
                   label='Account Number'
                   variant={"filled"}
                   className='w-xs'/>
        <TextField value={ifscCode}
                   onChange={e => setIfscCode(e.target.value)}
                   label='IFSC Code'
                   variant={"filled"}
                   className='w-xs'/>
        <Button disabled={!canSubmit()} onClick={handleSubmit} variant={"contained"} color={"secondary"}>
          {progress && <Box><CircularProgress size={14}/> &nbsp;&nbsp;</Box>}
            Update bank details</Button>
      </Box>
    </Paper>
  )
}

export default BankDetails;