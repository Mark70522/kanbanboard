<template>
  <div class="shell">
    <TheSidebar />       <!-- 左侧栏 -->

    <!-- Router 页面 → 右侧主区，加 class="main" -->
    <router-view v-slot="{ Component }">
      <component :is="Component" class="main" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue';
</script>

<style>
.shell{display:flex;height:100vh;overflow:hidden;}
.main{flex:1;overflow:auto;background:#efefef;}
</style>
