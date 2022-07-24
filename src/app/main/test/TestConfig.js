import React from "react";
import {authRoles} from "../../auth";

const TestConfig = {
    settings: {
        layout: {
            config: {
                navbar:{
                    display:true
                }
            },
        },
    },
    auth:authRoles.TEACHER,
    routes: [
        {
            path: '/create',
            component: React.lazy(() => import('./ManageTest'))
        },
        {
            path: '/manage/:id',
            component: React.lazy(() => import('./ManageTest'))
        },
        {
            path: '/explore',
            component: React.lazy(() => import('./ExploreTest'))
        },
    ],
};

export default TestConfig;
