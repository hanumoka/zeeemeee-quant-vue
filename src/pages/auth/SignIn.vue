<template>
  <q-page class="flex flex-center">
    <q-card flat :style="{ minWidth: '400px' }">
      <q-card-section>
        <div class="text-h6 text-weight-bold">로그인하기</div>
        <div class="text-subtitle2 text-grey">
          주식가치가 정확히 측정하능한 것이었다면, 증권시장은 존재할 필요가
          없다.
        </div>
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
import { ref, inject } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
});

const onSubmit = async () => {
  console.log('submit');
  console.log(
    `Username: ${form.value.username}, Password: ${form.value.password}`,
  );

  const param = new URLSearchParams();
  param.append('username', form.value.email);
  param.append('password', form.value.password);

  try {
    //TODO: axios를 이용해서 로그인 요청, application/x-www-from-urlencoded 형식으로 요쳥을 보내야 한다.
    const response = await api.post('/auth/sign-in', param, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(JSON.stringify(response.data));

    const { accessToken, refreshToken } = response?.data;

    if (accessToken && refreshToken) {
      $q.localStorage.set('accessToken', accessToken);
      $q.localStorage.set('refreshToken', refreshToken);
      router.push('/');
    } else {
      throw new Error('[로그인 실패] 토큰 없음');
    }
  } catch (error) {
    alert('로그인 실패');
    console.error(error);
  } //catch
};
</script>
