<template>
  <a-layout-header class="header">
    <div class="logo">MPK</div>

    <!-- Ant Design 菜单 -->
    <a-menu
      v-model:selectedKeys="selectedKeys"
      theme="dark"
      mode="horizontal"
      :items="items"
      @click="onMenuClick"
    />
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/* 当前激活菜单 */
const selectedKeys = ref<string[]>(['board']);

/* 两个菜单项示例，可根据需要增删 */
const items = [
  { key: 'board', label: '工作看板' },
  { key: 'about', label: '关于' },
];

function onMenuClick(e: any) {
  selectedKeys.value = [e.key];
  router.push({ name: e.key });
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.logo {
  color: #fff;
  font-weight: bold;
  margin-right: 24px;
}
</style>
