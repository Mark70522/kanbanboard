<template>
  <div
    class="card-row"
    :class="statusClass(card.status)"
    @dblclick="$emit('edit', card)"
  >
    <span class="title">{{ card.title }}</span>

    <span class="icons" @mousedown.stop @click.stop>
      <EditOutlined   class="icon" @click="$emit('edit',   card)" />
      <DeleteOutlined class="icon" @click="$emit('delete', card)" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { Card } from '../store/kanban';
defineProps<{ card: Card }>();
defineEmits<{ (e:'edit',   c:Card):void; (e:'delete', c:Card):void }>();
const statusClass = (s?:string)=> s? s.toLowerCase().replace(/\s/g,'') : 'nostatus';
</script>

<style scoped>
.card-row{display:flex;align-items:center;justify-content:space-between;
          padding:6px 12px;margin:6px 0;border-radius:6px;font-size:14px;
          cursor:grab;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,.25);}
.card-row:hover{box-shadow:0 3px 6px rgba(0,0,0,.35);}
.title{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.icons{display:flex;gap:10px;flex-shrink:0;}
.icon{font-size:16px;color:#ffd666;cursor:pointer;}
.icon:hover{color:#fff;}
.notstarted{background:#585858;color:#fff;}
.inprogress{background:#1f80ff;color:#fff;}
.done      {background:#169954;color:#fff;}
.nostatus  {background:#666;color:#fff;}
</style>