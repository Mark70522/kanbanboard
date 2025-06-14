<template>
  <a-config-provider :theme="{algorithm:isDark?theme.darkAlgorithm:theme.defaultAlgorithm}">
    <a-layout style="min-height:100vh">
      <TheSidebar />
      <a-layout>
        <TheHeader />
        <router-view />
      </a-layout>
    </a-layout>
    <FabButton @click="quickAddCol" />
  </a-config-provider>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { Modal, Input, theme } from 'ant-design-vue';
import TheSidebar from './components/TheSidebar.vue';
import TheHeader from './components/TheHeader.vue';
import FabButton from './components/FabButton.vue';
import { useKanban } from './store/kanban';

const isDark = ref(true);
const kanban = useKanban();
function quickAddCol(){
  const inp = ref<HTMLInputElement>();
  Modal.confirm({
    title:'New Column',
    content:()=>h(Input,{ref:inp,placeholder:'Column name'}),
    onOk(){const v=inp.value?.value.trim();if(v) kanban.addColumn(v);},
  });
}
</script>
<style scoped></style>