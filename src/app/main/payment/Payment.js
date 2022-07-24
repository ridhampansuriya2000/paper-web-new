import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import history from '@history'
import BankDetails from "./BankDetails";
import SwipeableViews from 'react-swipeable-views';
import {Box} from "@mui/material";
import Transactions from "./Transactions";

const Payment = () => {

  const [tabValue, setTabValue] = useState(window.location.pathname.includes('transactions') ? 0 : 1);

  useEffect(() => {
    if (tabValue === 0) {
      history.push('/payment/transactions')
    } else {
      history.push('/payment/bank-details')
    }
  }, [tabValue])


  return (
    <FusePageSimple

      contentToolbar={
        <Box className='bg-white h-64 w-full border-b-1 flex flex-row items-end px-24'>
        <Tabs
          value={tabValue}
          onChange={(e, value) => setTabValue(value)}
          indicatorColor='secondary'
          textColor='secondary'
          variant='scrollable'
        >
          <Tab className='text-14 normal-case' label='Transactions'/>
          <Tab className='text-14 normal-case' label='Bank Details'/>
        </Tabs>
        </Box>
      }

      content={
        <div className='p-24'>

          <SwipeableViews
            axis='x'
            index={tabValue}
            onChangeIndex={setTabValue}
          >
            <Transactions/>
            <Box className='flex flex-col'>
              <BankDetails/>
            </Box>
          </SwipeableViews>
        </div>
      }

    />
  )
}

export default Payment;