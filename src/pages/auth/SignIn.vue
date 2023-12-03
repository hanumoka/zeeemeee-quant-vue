<template>
  <q-page class="flex flex-center">
    <q-card flat :style="{ minWidth: '400px' }">
      <q-card-section>
        <div class="text-h6 text-weight-bold">로그인하기</div>
        <div class="text-subtitle2 text-grey">개발중... apiurl: {{apiUrl}} buildMode: {{buildMode}}</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="q-gutter-y-lg">
            <q-input
              filled
              v-model="form.email"
              label="Email"
              hint="Enter your email"
              type="email"
              lazy-rules
            />
            <q-input
              filled
              v-model="form.password"
              label="Password"
              hint="영문 대/소문자 포함 8자 이상"
              type="password"
              lazy-rules
            />
            <q-btn
              type="submit"
              color="primary"
              label="로그인"
              class="q-mt-lg full-width"
              unelevated
            />
            <q-btn
              label="회원가입"
              class="q-mt-md full-width"
              flat
              to="/auth/sign-up"
            />
            <!-- <q-btn label="dashboard" class="q-mt-xㄴ full-width" flat to="/" /> -->
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
//TODO: form 벨리데이션
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
});

const apiUrl = process.env.VUE_APP_API_URL || process.env.VITE_API_URL ||  import.meta.env.VITE_API_URL;;
const buildMode = process.env.NODE_ENV;

const onSubmit = async () => {
  console.log('submit');
  console.log(
    `Username: ${form.value.username}, Password: ${form.value.password}`,
  );

  const param = {
    username: form.value.email,
    password: form.value.password,
  };

  try {
    const response = await api.post('/auth/sign-in', param);

    console.log(JSON.stringify(response.data));

    const { accessToken, refreshToken } = response?.data;

    if (accessToken && refreshToken) {
      $q.localStorage.set('accessToken', accessToken);
      $q.localStorage.set('refreshToken', refreshToken);
      router.push('/');
      $q.notify({
        color: 'positive',
        message: '로그인 성공',
        position: 'top',
        icon: 'check',
      });
    } else {
      throw new Error('[로그인 실패] 토큰 없음');
    }
  } catch (error) {
    // alert('로그인 실패');
    console.error(error);
    $q.notify({
      color: 'negative',
      message: '로그인 실패',
      position: 'top',
      icon: 'report_problem',
    });
  } //catch
};
</script>
