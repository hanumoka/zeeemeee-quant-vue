import { boot } from 'quasar/wrappers';
import axios from 'axios';

const testMode = false;

const api = axios.create({
  baseURL: testMode ? 'http://localhost:8000' : 'http://localhost:8000',
});

// for use inside Vue files through this.$axios and this.$api
// (only in Vue Options API form)
export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

// Here we define a named export
// that we can later use inside .js files:
export { axios, api };
