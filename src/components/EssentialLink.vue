<template>
  <q-item clickable tag="a" :to="to" v-if="subLinks.length === 0">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item
    :content-inset-level="0.5"
    expand-separator
    :icon="icon"
    :label="title"
    :caption="caption"
    default-opened
    v-if="subLinks.length > 0"
  >
    <q-item
      clickable
      tag="a"
      :to="to"
      v-for="subLinkItem in subLinks"
      :key="subLinkItem.title"
      v-bind="subLinkItem"
    >
      <q-item-section v-if="subLinkItem.icon" avatar>
        <q-icon :name="subLinkItem.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ subLinkItem.title }}</q-item-label>
        <q-item-label caption>{{ subLinkItem.caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  to: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },

  subLinks: {
    type: Array,
    default: () => [],
  },
});
</script>
