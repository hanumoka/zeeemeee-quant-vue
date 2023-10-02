<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Sonjul Admin </q-toolbar-title>

        <q-btn flat round dense :icon="dartModeIcon" @click="toggleDarkMode" />

        <q-btn round size="sm" class="q-ml-md">
          <q-avatar color="primary" text-color="white">{{
            signInUserInfo?.username?.charAt(0)
          }}</q-avatar>
          <q-menu :offset="[0, 10]">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/profile">
                <q-item-section>프로필</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/auth/sign-in">
                <q-item-section>로그아웃</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <!-- <q-avatar size="lg" class="q-mr-sm">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar> -->
          <span>Sonjul v0.0.1</span>
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
const linksList = [
  // {
  //   title: 'Typography',
  //   caption: 'quasar.dev',
  //   icon: 'school',
  //   to: '/typography',
  // },
  // {
  //   title: 'Colors',
  //   caption: 'quasar.dev',
  //   icon: 'school',
  //   to: '/colors',
  // },
  {
    title: 'finacne-data-reader',
    caption: '주식수집기',
    icon: 'school',
    subLinks: [
      {
        title: 'Dashboard',
        caption: '대시보드',
        icon: 'email',
        to: '/finance-data-reader/dashboard',
      },
      {
        title: 'Job관리',
        caption: 'Job을 관리한다.',
        icon: 'email',
        to: '/finance-data-reader/job',
      },
      {
        title: 'KRX Items',
        caption: 'KRX 주식종목 수집기',
        icon: 'email',
        to: '/finance-data-reader/krx-items',
      },
      {
        title: 'KRX Daily Trade Data',
        caption: 'KRX 일일거래정보',
        icon: 'email',
        to: '/finance-data-reader/krx-daily-trade-data',
      },
    ],
  },
];

import { computed, defineComponent, ref, onMounted } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

const $q = useQuasar();

const leftDrawerOpen = ref(false);
const essentialLinks = linksList;
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const dartModeIcon = computed(() =>
  $q.dark.isActive ? 'dark_mode' : 'light_mode',
);

const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set('darkMode', $q.dark.isActive);
};

const signInUserInfo = ref(null);

onMounted(async () => {
  console.log('mainLayout onMounted');
  try {
    const response = await api.post('/auth/info', {});
    console.log(JSON.stringify(response.data));
    signInUserInfo.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>
