<template>
  <!-- 列选择浮窗 -->
  <AddCardMenu :open="menuOpen" @select="openDialog" />

  <!-- 右下主按钮：+ ⇄ × -->
  <a-float-button
    shape="circle"
    type="primary"
    :icon="menuOpen ? CloseOutlined : PlusOutlined"
    style="right:32px;bottom:32px"
    @click="menuOpen = !menuOpen"
  />

  <!-- 共用 CardDialog：card-id=null → 新建 -->
  <CardDialog
    v-model:open="dialogOpen"
    :column-id="targetCol"
    :card-id="null"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import AddCardMenu from './AddCardMenu.vue';
import CardDialog from './CardDialog.vue';

const menuOpen   = ref(false);     // 控制列列表显隐
const dialogOpen = ref(false);     // 控制弹窗
const targetCol  = ref<string|null>(null);

/* 选中列 → 打开对话框 */
function openDialog(colId: string){
  targetCol.value = colId;
  dialogOpen.value = true;
  menuOpen.value   = false;
}
</script>
