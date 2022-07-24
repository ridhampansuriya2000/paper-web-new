import React from "react";
import {authRoles} from "../../auth";

const TestsConfig = {
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
      path: '/tests',
      component: React.lazy(() => import('./Tests')),
    },
    {
      path: '/enrolled-tests',
      component: React.lazy(() => import('./EnrolledTests')),
    },
    {
      path: '/attempted-tests',
      component: React.lazy(() => import('./AttemptedTests')),
    },
    {
      path: '/attempted-test/students/:testId/:studentId/:attemptId',
      component: React.lazy(() => import('./AnswerSheet')),
    },
    {
      path: '/attempted-test/students/:testId/:studentId',
      component: React.lazy(() => import('./AttemptedList')),
    },
    {
      path: '/attempted-test/students/:testId',
      component: React.lazy(() => import('./StudentList')),
    },
    {
      path: '/attempted-test/:testId',
      component: React.lazy(() => import('./AttemptedTest')),
    },
    {
      path: '/answer-sheet/:testId/:attemptId',
      component: React.lazy(() => import('./AnswerSheet')),
    },
  ],
};

export default TestsConfig;
