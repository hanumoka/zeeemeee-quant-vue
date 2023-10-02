<template>
  <q-page>
    <section class="q-pa-xl">
      <div class="text-h4">Headings</div>
      <div class="text-h1">한글 잘 나옴?</div>
      <button v-on:click="onAction">로딩버튼</button>
    </section>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';

const $q = useQuasar();

const onAction = () => {
  $q.loading.show(); // 로딩 시작
  setTimeout(() => {
    $q.loading.hide(); // 로딩 종료
  }, 2000);
};

// $q.loadingBar.setDefaults({
//   color: 'secondary',
//   size: '5px',
//   position: 'top',
//   skipHijack: true,
// });

// $q.loadingBar.start(); // 로딩바 시작
// setTimeout(() => {
//   $q.loadingBar.stop(); // 로딩바 종료
// }, 2000);
</script>

<style lang="scss" scoped></style>
