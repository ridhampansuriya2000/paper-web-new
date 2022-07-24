import {authRoles} from "../auth";

const navigationConfig = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: 'dashboard',
        url: '/dashboard',
        auth:authRoles.USER
    },
    {
        id: 'at_tests',
        title: 'Attempted Tests',
        type: 'item',
        icon: 'list',
        url: '/attempted-tests',
        // auth:authRoles.STUDENT
    },
    // {
    //     id: 'at_tests',
    //     title: 'Attempted Test',
    //     type: 'item',
    //     icon: 'list',
    //     url: '/attempted-test',
    //     auth:authRoles.STUDENT
    // },
    {
        id: 'en_tests',
        title: 'Enrolled Tests',
        type: 'item',
        icon: 'assignment',
        url: '/enrolled-tests',
        auth:authRoles.STUDENT
    },
    {
        id: 'tests',
        title: 'Explore Tests',
        type: 'item',
        icon: 'search',
        url: '/tests',
        auth:authRoles.STUDENT
    },
    {
        id: 'test',
        title: 'Test',
        type: 'collapse',
        icon: 'assessment',
        // url: '/create',
        auth:authRoles.TEACHER,
        children : [
            {
                id   : 'create-test',
                title: 'Create Test',
                type : 'item',
                url : '/create',
                auth:authRoles.TEACHER,
            },
            {
                id   : 'explore-test',
                title: 'Explore Test',
                type : 'item',
                url : '/explore',
                auth:authRoles.TEACHER,
            }
        ]
    },
    {
        id: 'analytics',
        title: 'Analytics',
        type: 'collapse',
        icon: 'bar_chart',
        auth:authRoles.TEACHER,
        children : [
            {
                id   : 'attempt-result',
                title: 'Attempt Result',
                type : 'item',
                url : '/attempt-result',
                auth:authRoles.TEACHER,
            },
            {
                id   : 'test-created-result',
                title: 'Test Created Result',
                type : 'item',
                url : '/test-created-result',
                auth:authRoles.TEACHER,
            },
            {
                id   : 'purchase',
                title: 'Purchase',
                type : 'item',
                url : '/purchase',
                auth:authRoles.TEACHER,
            }
        ]
    },
    {
        id: 'analytics-student',
        title: 'Analytics',
        type: 'collapse',
        icon: 'bar_chart',
        auth:authRoles.STUDENT,
        children : [
            {
                id   : 'totalAttempts',
                title: 'Tries',
                type : 'item',
                url : '/total-attempts',
                auth:authRoles.STUDENT,
            }
        ]
    },
    {
        id: 'payment',
        title: 'Payment',
        type: 'item',
        icon: 'account_balance_wallet',
        url: '/payment/transactions',
        auth:authRoles.TEACHER
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'item',
        icon: 'settings',
        url: '/settings',
    },
    {
        id: 'logout',
        title: 'Logout',
        translate: 'Logout',
        type: 'item',
        icon: 'power_settings_new',
        url: '/logout',
        auth:authRoles.USER
    },


];

export default navigationConfig;
