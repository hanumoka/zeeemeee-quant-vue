<template>
  <q-page class="flex flex-center">
    <q-card flat :style="{ minWidth: '400px' }">
      <q-card-section>
        <div class="text-h6 text-weight-bold">로그인하기</div>
        <div class="text-subtitle2 text-grey">또 와주셔서 감사합니다.</div>
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
              v-model="password"
              label="Password"
              hint="영문 대/소문자 포함 8자 이상"
              type="password"
              lazy-rules
              :rules="[val => !!val || 'Please enter your password']"
            />
            <q-btn
              type="submit"
              color="primary"
              label="Sign in"
              class="q-mt-lg full-width"
              unelevated
              :disable="!$refs.form?.valid"
            />
            <q-btn
              label="Sign up"
              class="q-mt-md full-width"
              flat
              to="/auth/sign-up"
            />
            <q-btn label="dashboard" class="q-mt-xㄴ full-width" flat to="/" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup></script>
