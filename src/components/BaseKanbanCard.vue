<template>
  <!-- ★ 插槽唯一根 —— vuedraggable 不再报错 -->
  <div
    class="card-row"
    :class="statusClass(card.status)"
    @dblclick="$emit('edit', card)"
  >
    <span class="title">{{ card.title }}</span>

    <span class="icons" @mousedown.stop @click.stop>
      <EditOutlined   class="icon" title="Edit"   @click="$emit('edit',   card)" />
      <DeleteOutlined class="icon" title="Delete" @click="$emit('delete', card)" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { Card } from '../store/kanban';
defineProps<{ card: Card }>();
defineEmits<{ (e:'edit',   c:Card):void; (e:'delete', c:Card):void }>();

const statusClass = (s?:string)=> s ? s.toLowerCase().replace(/\s/g,'') : 'nostatus';
</script>

<style scoped>
.card-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:8px 12px;margin:0 4px;border-radius:8px;
  background:#fff;color:#000;font-size:14px;
  cursor:grab;user-select:none;
  box-shadow:0 1px 3px rgba(0,0,0,.12);
  transition:transform .12s,box-shadow .12s;
}
.card-row:hover   { box-shadow:0 3px 8px rgba(0,0,0,.18); }
.card-row:active  { cursor:grabbing; }
/* 拖拽时由 Sortable 添加的类 */
.chosen  { transform:scale(1.04);box-shadow:0 4px 14px rgba(0,0,0,.28); }
.ghost   { opacity:.4; }
.dragging{ cursor:grabbing; }

.title{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.icons{display:flex;gap:8px;flex-shrink:0;}
.icon {font-size:17px;color:#8c8c8c;cursor:pointer;}
.icon:hover{color:#1890ff;}

/* 左侧状态圆点（利用 currentColor） */
.card-row::before{
  content:'';width:6px;height:6px;border-radius:50%;margin-right:8px;
  background:currentColor;
}
.notstarted{ color:#faad14; }
.inprogress{ color:#1890ff; }
.done{       color:#52c41a; }
.nostatus{   color:#aaaaaa; }
</style>
