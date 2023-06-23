import { boot } from 'quasar/wrappers';

/**
 * 퀘이사에서 제공하는 boot 함수를 이용하여 전역으로 사용할 수 있는 변수를 선언할 수 있습니다.
 * 이렇게 생성된 boot 설정은 quasar.conf.js 파일의 boot 항목에 등록해야 합니다.
 */

export default boot(({ app }) => {
  app.config.globalProperties.hello = 'hello Quasar!';
});
