<template>
  <a-layout-header style="background:#0d1117;color:#fff;display:flex;align-items:center;padding:0 16px;">
    <div style="font-weight:bold;margin-right:24px">MPK</div>
    <a-menu v-model:selectedKeys="sel" mode="horizontal" theme="dark">
      <a-menu-item key="board">Board</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const sel = ref<string[]>(['board']);
</script>
