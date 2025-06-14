<template>
  <a-layout-sider width="56" theme="dark" class="sidebar">
    <div class="add-board" @click="newBoard">
      <PlusOutlined />
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { Modal, Input } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';
import { useKanban } from '../store/kanban';
const kanban = useKanban();

function newBoard(){
  const inp = ref();
  Modal.confirm({
    title:'New Board',
    content:()=>h(Input,{ref:inp,placeholder:'Board name'}),
    onOk(){
      const name = inp.value?.value.trim();
      if(name) kanban.addBoard(name);
    },
  });
}
</script>

<style scoped>
.sidebar{display:flex;justify-content:flex-start;align-items:center;padding-top:14px;}
.add-board{width:42px;height:42px;border-radius:21px;background:#d5ff8c;
           display:flex;align-items:center;justify-content:center;cursor:pointer;}
.add-board:hover{background:#caff63;}
</style>
