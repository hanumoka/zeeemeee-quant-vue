import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Before request, add token from localStorage to the header.
api.interceptors.request.use(
  config => {
    const token = LocalStorage.getItem('accessToken');
    console.log('accessToken:' + token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// On response error, if error is 401 or 403, try to refresh the token.
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/sign-in'
    ) {
      const refreshToken = LocalStorage.getItem('refreshToken');

      try {
        const param = {
          refreshToken: refreshToken,
        };
        // Assuming you have an endpoint to refresh the token.
        const { data } = await api.post('/auth/refresh', param);

        LocalStorage.set('accessToken', data.accessToken);
        LocalStorage.set('refreshToken', data.refreshToken);
        api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest); // Retry the original request with new token.
      } catch (refreshError) {
        LocalStorage.remove('accessToken');
        LocalStorage.remove('refreshToken');
        axios.defaults.router.push({ path: '/auth/sign-in' });
        // Redirect 는 router/index.js 에서 처리하면 안되것네, 거기도 코드가 있긴 해야 하겠지만. 여기서도 처리해 주자.(새로고침 시에도 처리해 주어야 하니까.)
        return Promise.reject(refreshError);
      }
    } else {
      return Promise.reject(error);
    }
  },
);

// for use inside Vue files through this.$axios and this.$api
// (only in Vue Options API form)
export default boot(({ app, router }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  // axios의 기본 설정에 router 객체 추가
  axios.defaults.router = router;
});

// Here we define a named export
// that we can later use inside .js files:
export { axios, api };
