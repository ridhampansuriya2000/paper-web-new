import React from 'react';
import { authRoles } from '../../auth';

const SettingsConfig = {
  settings: {
    layout: {
      config: {
        navbar:{
          display:true
        }
      },
    },
  },
  auth: authRoles.USER,
  routes: [
    {
      path: '/settings',
      component: React.lazy(() => import('./Settings')),
    },
    {
      path: '/logout',
      component: React.lazy(() => import('./Logout')),
    },
  ],
};

export default SettingsConfig;