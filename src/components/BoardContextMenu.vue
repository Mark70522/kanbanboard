<template>
  <a-dropdown trigger="click" placement="topLeft" v-model:open="open">
    <template #overlay>
      <a-menu>
        <a-menu-item @click="rename">Rename the board</a-menu-item>
        <a-menu-item danger @click="del">Delete current board</a-menu-item>
      </a-menu>
    </template>
    <EllipsisOutlined style="font-size:20px;color:#bbb" />
  </a-dropdown>
</template>
<script setup lang="ts">
import { defineModel, ref, h } from 'vue';
import { Modal, Input, message } from 'ant-design-vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { useKanban } from '../store/kanban';

const kanban = useKanban();
const open = defineModel<boolean>('open');

function rename() {
  const inp = ref<HTMLInputElement>();
  Modal.confirm({
    title:'Rename board',
    content:() => h(Input,{ref:inp,defaultValue:kanban.current.name}),
    onOk(){ const v = inp.value?.value.trim(); if(v) kanban.current.name = v; },
  });
}
function del() {
  Modal.confirm({
    title:'Delete current board?',
    okType:'danger',
    onOk(){
      kanban.boards = kanban.boards.filter(b=>b.id!==kanban.currentId);
      kanban.currentId = kanban.boards[0]?.id || '';
      if(!kanban.currentId) kanban.addBoard('New board');
      message.success('Deleted');
    },
  });
}
</script>