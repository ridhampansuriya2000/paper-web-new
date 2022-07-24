import React from "react";
import {authRoles} from "../../auth";

const DashboardConfig = {
    settings: {
        layout: {
            config: {
                navbar:{
                    display:true
                }
            },
        },
    },
    auth:authRoles.USER,
    routes: [
        {
            path: '/dashboard',
            component: React.lazy(() => import('./Dashboard'))
        },
    ],
};

export default DashboardConfig;

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
