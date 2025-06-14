<template>
  <transition name="fade">
    <div v-if="open" class="menu">
      <div
        v-for="col in kanban.current.columns"
        :key="col.id"
        class="item"
        @click="$emit('select', col.id)"
      >
        <span>{{ col.name }}</span>
        <PlusOutlined />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { useKanban } from '../store/kanban';

defineProps<{ open: boolean }>();
defineEmits<{ (e:'select', colId:string):void }>();

const kanban = useKanban();
</script>

<style scoped>
.menu{position:fixed;right:84px;bottom:100px;display:flex;flex-direction:column;gap:8px;}
.item{background:#fff;border-radius:6px;padding:6px 14px;box-shadow:0 2px 8px rgba(0,0,0,.25);
      cursor:pointer;display:flex;justify-content:space-between;min-width:170px;}
.item:hover{background:#f5f5f5;}
.fade-enter-active,.fade-leave-active{transition:opacity .2s;}
.fade-enter-from,.fade-leave-to{opacity:0;}
</style>
