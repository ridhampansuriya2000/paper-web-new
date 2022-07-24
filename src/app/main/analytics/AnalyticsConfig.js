import React from "react";
import {authRoles} from "../../auth";

const AnalyticsConfig = {
    settings: {
        layout: {
            config: {
                navbar:{
                    display:true
                }
            },
        },
    },
    // auth:authRoles.TEACHER,
    routes: [
        {
            path: '/attempt-result',
            component: React.lazy(() => import('./AttemptResult'))
        },
        {
            path: '/test-created-result',
            component: React.lazy(() => import('./TestCreatedResult'))
        },
        {
            path: '/purchase',
            component: React.lazy(() => import('./Purchase'))
        },
        {
            path: '/total-attempts',
            component: React.lazy(() => import('./Tries'))
        },
    ],
};

export default AnalyticsConfig;
