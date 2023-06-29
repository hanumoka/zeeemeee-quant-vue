<template>
  <!-- class="flex flex-center" -->
  <div class="row window-height">
    <div class="col" :class="leftColStyle">
      <q-img height="100vh" src="/sign-up-bg.png" />
    </div>
    <div class="col flex flex-center">
      <q-card flat :style="{ minWidth: '400px' }">
        <q-card-section>
          <div class="text-h6 text-weight-bold">회원가입</div>
          <div class="text-subtitle2 text-grey">감사합니다.</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit">
            <div class="q-gutter-y-lg">
              <q-input
                filled
                v-model="email"
                label="Email"
                hint="Enter your email"
                type="email"
                lazy-rules
                :rules="[val => !!val || 'Please enter your email']"
              />
              <q-input
                filled
                label="비밀번호"
                hint="영문 대/소문자 포함 8자 이상"
                type="password"
                lazy-rules
                :rules="[val => !!val || 'Please enter your password']"
              />
              <q-input
                filled
                label="비밀번호 확인"
                hint="영문 대/소문자 포함 8자 이상"
                type="password"
                lazy-rules
                :rules="[val => !!val || 'Please enter your password']"
              />
              <q-btn
                type="submit"
                color="primary"
                label="가입하기"
                class="q-mt-lg full-width"
                unelevated
                :disable="!$refs.form?.valid"
              />
              <q-btn
                label="로그인하기"
                class="q-mt-md full-width"
                flat
                to="/auth/sign-in"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const leftColStyle = computed(() => ({
  hidden: $q.screen.lt.md,
}));
</script>
