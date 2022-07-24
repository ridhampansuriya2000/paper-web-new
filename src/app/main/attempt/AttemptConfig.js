import React from 'react';
import {authRoles} from "../../auth";

const PaymentConfig = {
  settings: {
    layout: {
      config: {
        navbar:{
          display:false
        }
      },
    },
  },
  auth: authRoles.STUDENT,
  routes: [
    {
      path: '/attempt/:id/:attemptId',
      component: React.lazy(() => import('./Attempt')),
    },
  ]
}

export default PaymentConfig;