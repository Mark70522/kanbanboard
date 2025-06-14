# src/App.vue
<template>
  <a-layout style="min-height: 100vh">
    <TheHeader />
    <router-view />
    <TheFooter />
  </a-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
html,body,#app{
  margin:0;
  padding:0;
  height:100%;
}
</style>
<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>