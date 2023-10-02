const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'typography', component: () => import('pages/Typography.vue') },
      { path: 'colors', component: () => import('pages/Colors.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'sign-in',
        name: 'sign-in',
        component: () => import('pages/auth/SignIn.vue'),
      },
      { path: 'sign-up', component: () => import('pages/auth/SignUp.vue') },
    ],
  },

  // /finance-data-reader/krx-items
  {
    path: '/finance-data-reader',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('src/pages/finance_data_reader/DashBoard.vue'),
      },
      {
        path: 'job',
        component: () => import('src/pages/finance_data_reader/Job.vue'),
      },
      {
        path: 'krx-items',
        component: () => import('src/pages/finance_data_reader/KrxItems.vue'),
      },
      {
        path: 'krx-daily-trade-data',
        component: () =>
          import('src/pages/finance_data_reader/KrxDailyTradeData.vue'),
      },
    ],
  },

  //test
  {
    path: '/test',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'apex-chart-test/1',
        component: () => import('src/pages/test/ApexChartTest1.vue'),
      },
      {
        path: 'apex-chart-test/2',
        component: () => import('src/pages/test/ApexChartTest2.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
