import React from 'react';
import authRoles from './authRoles';

const AuthConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar:{
          display:false
        }
      },
    },
  },
  auth:authRoles.onlyGuest,
  routes: [
    {
      path: '/login',
      component: React.lazy(() => import('./Login')),
    },
    {
      path: '/signup',
      component: React.lazy(() => import('./Signup')),
    },
  ],
};

export default AuthConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }
    ]
};

export default ExampleConfig;

*/
