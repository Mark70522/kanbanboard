<template>
  <a-layout-content style="padding:5px">
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
/* 仅此处：修改背景色 / 渐变 —— 其余样式保持 */
.board-wrap{
  display:flex;
  gap:24px;
  padding:24px;
  overflow-x:auto;
  min-height:100%;

  /* ⬇⬇ 你可以在这儿换成任意背景 ⬇⬇ */
  /* 示例 1：柔和浅灰 */
  /* background:#f0f2f5; */

  /* 示例 2：淡淡蓝灰渐变 */
  background:linear-gradient(135deg,#b5cfbe 0%,#d1e8c2 100%);

  /* 示例 3：纯色深蓝（夜间主题） */
  /* background:#1a1b1f; */
}
/* 下面这行如果不需要空提示可删除 */
.empty{padding:40px;text-align:center;font-size:18px;color:#999;}
</style>
