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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
