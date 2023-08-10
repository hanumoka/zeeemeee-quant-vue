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
          <q-avatar>
            <img src="/logo.png" alt="" />
          </q-avatar>
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
          <q-avatar size="lg" class="q-mr-sm">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <span>Quasar v{{ $q.version }}</span>
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <!-- 아코디언 메뉴 예시 -->
        <!-- <q-expansion-item
          :content-inset-level="0.5"
          expand-separator
          icon="mail"
          label="Inbox"
          caption="5 unread emails"
          default-opened
        >
          <q-expansion-item
            expand-separator
            :content-inset-level="0.5"
            icon="receipt"
            label="Receipts"
          >
            <q-expansion-item label="Today" :content-inset-level="0.5">
              <q-card>
                <q-card-section>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quidem, eius reprehenderit eos corrupti commodi magni quaerat
                  ex numquam, dolorum officiis modi facere maiores architecto
                  suscipit iste eveniet doloribus ullam aliquid.
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item label="Yesterday" :content-inset-level="0.5">
              <q-card>
                <q-card-section>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quidem, eius reprehenderit eos corrupti commodi magni quaerat
                  ex numquam, dolorum officiis modi facere maiores architecto
                  suscipit iste eveniet doloribus ullam aliquid.
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item
            :content-inset-level="0.5"
            expand-separator
            icon="schedule"
            label="Postponed"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const linksList = [
  {
    title: 'Typography',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/typography',
  },
  {
    title: 'Colors',
    caption: 'quasar.dev',
    icon: 'school',
    to: '/colors',
  },
  {
    title: 'finacne-data-reader',
    caption: '주식수집기',
    icon: 'school',
    subLinks: [
      {
        title: 'KRX-Stock-Items',
        caption: '종목',
        icon: 'school',
        to: '/finance-data-reader/krx-stock-items',
      },
    ],
  },
];
</script>

<script setup>
import { computed, defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const leftDrawerOpen = ref(false);
const essentialLinks = linksList;
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const dartModeIcon = computed(() =>
  $q.dark.isActive ? 'dark_mode' : 'light_mode',
);

// const init = () => {
//   const darkMode = $q.localStorage.getItem('darkMode');
//   $q.dark.set(darkMode);
// };

// init();

const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set('darkMode', $q.dark.isActive);
};
</script>
