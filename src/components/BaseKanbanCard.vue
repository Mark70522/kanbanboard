<template>
  <div
    class="card-row"
    :class="statusClass(card.status)"
    @dblclick="$emit('edit', card)"
  >
    <span class="title">{{ card.title }}</span>

    <span class="icons" @mousedown.stop @click.stop>
      <a-tag 
  v-if="card.status === 'In progress' && card.priority" 
  :style="{ backgroundColor: getPriorityColor(card.priority), color: '#fff' }"
  class="priority-tag"
>
  {{ card.priority }}
</a-tag>
      <EditOutlined class="icon" @click="$emit('edit', card)" />
          <!-- 优先级标签 -->
      <DeleteOutlined class="icon" @click="$emit('delete', card)" />
      <template v-if="card.status === 'Done'">
        <a-tooltip title="archive">
          <InboxOutlined class="icon" @click="$emit('archive', card)" />
        </a-tooltip>
      </template>
    </span>
  </div>
</template>
<script setup lang="ts">
import { EditOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons-vue'; // 用 InboxOutlined 替代
import { defineProps, defineEmits } from 'vue';
import type { Card } from '../store/kanban';

defineProps<{ card: Card }>();
defineEmits<{ 
  (e:'edit', c:Card):void; 
  (e:'delete', c:Card):void;
  (e:'archive', c:Card):void;
}>();

const statusClass = (s?: string) => (s ? s.toLowerCase().replace(/\s/g, '') : 'nostatus');
// 优先级颜色映射
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'H':
      return 'red';
    case 'M':
      return 'orange';
    case 'L':
      return 'green';
    default:
      return 'blue';
  }
};
</script>

<style scoped>
.card-row{
  display:flex;align-items:center;justify-content:space-between;

  padding:8px 14px;
  margin:6px 0;
  border-radius:8px;

  /* ✧ 奶灰而非纯白 */
  background:#f7f7f7;
  color:#000;
  font-size:14px;font-weight:500;

  cursor:grab;user-select:none;
  box-shadow:0 1px 2px rgba(0,0,0,.08);
  transition:box-shadow .12s;
}
.card-row:hover { box-shadow:0 3px 6px rgba(0,0,0,.13); }
.card-row:active{ cursor:grabbing; }

.title{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.icons{display:flex;gap:10px;flex-shrink:0;}
.icon {font-size:17px;color:#8c8c8c;cursor:pointer;transition:color .15s;}
.icon:hover{color:#1890ff;}

/* 状态色不变 */
.notstarted{background:#585858;color:#fff;}
.inprogress{background:#1f80ff;color:#fff;}
.done      {background:#169954;color:#fff;}
.nostatus  {background:#666;color:#fff;}
</style>