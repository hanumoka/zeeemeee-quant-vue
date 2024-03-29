import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { LoadingBar, LocalStorage } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem('accessToken');
    LoadingBar.start(); // 로딩바 시작
    if (!token && to.path !== '/auth/sign-in') {
      LocalStorage.remove('accessToken');
      LocalStorage.remove('refreshToken');
      if (to.path === '/auth/sign-up' || to.path === '/auth/sign-in') {
        next();
      } else {
        next('/auth/sign-in');
      } // else
    } else if (to.path === '/auth/sign-in') {
      LocalStorage.remove('accessToken');
      LocalStorage.remove('refreshToken');
      next();
    } else {
      next();
    } // else
  });
  Router.afterEach(() => {
    LoadingBar.stop(); // 로딩바 종료
  });

  return Router;
});
