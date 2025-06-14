<template>
  <a-layout-content style="padding:24px">
    <div class="board-wrap">
      <BaseKanbanColumn
        v-for="col in kanban.current.columns"
        :key="col.id"
        :column="col"
      />
    </div>
  </a-layout-content>

  <!-- 右下浮动按钮 -->
  <FabButton @click="addColumn" />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { Modal, Input } from 'ant-design-vue';
import BaseKanbanColumn from '@/components/BaseKanbanColumn.vue';
import FabButton from '@/components/FabButton.vue';
import { useKanban } from '@/store/kanban';

const kanban = useKanban();

function addColumn() {
  const inp = ref<HTMLInputElement>();
  Modal.confirm({
    title: 'New Column',
    content: () => h(Input, { ref: inp, placeholder: 'Column name' }),
    onOk() {
      const v = inp.value?.value.trim();
      if (v) kanban.addColumn(v);
    },
  });
}
</script>

<style scoped>
.board-wrap { display:flex; gap:16px; overflow-x:auto; }
</style>
