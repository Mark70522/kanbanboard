<template>
  <a-layout-content style="padding: 24px">
    <div style="display:flex; gap:16px; overflow-x:auto;">
      <BaseKanbanColumn
        v-for="col in board.columns"
        :key="col.id"
        :column="col"
        :data-column="col.id"
      />
      <a-button type="dashed" @click="addColumn">+ Add Column</a-button>
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import { useBoardStore } from '../store';
import BaseKanbanColumn from '../components/BaseKanbanColumn.vue';
import { ref } from 'vue';
import { Modal } from 'ant-design-vue';

const board = useBoardStore();

function addColumn() {
  Modal.confirm({
    title: 'New Column',
    content: `<input id="column-name" placeholder="Column name" />`,
    onOk() {
      const input = document.getElementById('column-name') as HTMLInputElement;
      if (input && input.value.trim()) {
        board.addColumn(input.value.trim());
      }
    },
  });
}
</script>

<style scoped></style>