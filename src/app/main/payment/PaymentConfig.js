import React from 'react';
import {authRoles} from "../../auth";

const PaymentConfig = {
  settings: {
    layout: {
      config: {
        navbar:{
          display:true
        }
      },
    },
  },
  auth: authRoles.TEACHER,
  routes: [
    {
      path: '/payment',
      component: React.lazy(() => import('./Payment')),
    },
]
}

export default PaymentConfig;