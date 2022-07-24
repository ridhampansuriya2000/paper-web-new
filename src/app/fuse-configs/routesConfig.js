import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import DashboardConfig from 'app/main/dashboard/DashboardConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import AuthConfig from '../auth/AuthConfig';
import SettingsConfig from "../main/settings/SettingsConfig";
import TestConfig from "../main/test/TestConfig";
import PaymentConfig from "../main/payment/PaymentConfig";
import AttemptConfig from "../main/attempt/AttemptConfig";
import TestsConfig from "../main/tests/TestsConfig";
import AnalyticsConfig from "../main/analytics/AnalyticsConfig";


const routeConfigs = [DashboardConfig,AttemptConfig,TestsConfig, SettingsConfig, PaymentConfig, TestConfig, AuthConfig, AnalyticsConfig];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/dashboard" />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
