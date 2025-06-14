<template>
  <a-card :title="column.name" class="kanban-column">
    <draggable
      v-model="column.cards"
      group="cards"
      item-key="id"
      class="kanban-cards"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <BaseKanbanCard :card="element" />
      </template>
    </draggable>

    <a-input-search
      v-model:value="newCardTitle"
      placeholder="Add a card"
      enter-button="Add"
      @search="handleAdd"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import BaseKanbanCard from './BaseKanbanCard.vue';

import { useBoardStore } from '../store';         // 运行时需要
import type { Card, Column } from '../store';     // 纯类型，用 import type

/* 组件属性类型 */
const props = defineProps<{ column: Column }>();

const board = useBoardStore();
const newCardTitle = ref('');

/* 添加卡片 */
function handleAdd() {
  if (!newCardTitle.value.trim()) return;
  board.addCard(props.column.id, newCardTitle.value.trim());
  newCardTitle.value = '';
}

/* 拖拽结束：更新位置 */
function onDragEnd(evt: any) {
  if (!evt || !evt.item) return;
  board.moveCard(
    evt.item.dataset.id,
    evt.from.dataset.column,
    evt.to.dataset.column,
    evt.newIndex,
  );
}
</script>

<style scoped>
.kanban-column {
  width: 300px;
}
.kanban-cards {
  min-height: 60px;
  margin-bottom: 1rem;
}
</style>
