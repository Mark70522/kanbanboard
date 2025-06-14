<template>
  <div
    class="card-row"
    :class="statusClass(card.status)"
    @dblclick="$emit('edit', card)"
  >
    <span class="title">{{ card.title }}</span>

    <span class="icons" @mousedown.stop @click.stop>
      <EditOutlined class="icon" @click="$emit('edit', card)" />
      <DeleteOutlined class="icon" @click="$emit('delete', card)" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { Card } from '../store/kanban';
defineProps<{ card: Card }>();
defineEmits<{ (e:'edit', c:Card):void; (e:'delete', c:Card):void }>();
const statusClass = (s?: string) => (s ? s.toLowerCase().replace(/\s/g, '') : 'nostatus');
</script>

<style scoped>
/* ───────── 卡片主体 ───────── */
.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px 14px;
  margin: 4px 0;
  border-radius: 8px;

  background: #fff;
  color: #000;
  font-size: 14px;
  font-weight: 500;

  cursor: grab;
  user-select: none;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.12s;
}
.card-row:hover  { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.20); }
.card-row:active { cursor: grabbing; }

/* Sortable 内置类（若以后想加拖拽透明/放大，可在这里再写）
.chosen { transform: scale(1.04); opacity: .9; }
.ghost  { opacity: .4; }
*/

/* 文本 & 图标 */
.title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.icons { display: flex; gap: 10px; flex-shrink: 0; }
.icon  { font-size: 17px; color: #8c8c8c; cursor: pointer; transition: color 0.15s; }
.icon:hover { color: #1890ff; }

/* 保留你的三种状态色 */
.notstarted { background: #585858; color: #fff; }
.inprogress { background: #1f80ff; color: #fff; }
.done       { background: #169954; color: #fff; }
.nostatus   { background: #666;    color: #fff; }
</style>
