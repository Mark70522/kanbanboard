<template>
  <a-card :title="header" class="kanban-column" :body-style="{padding:'8px'}">
    <draggable
      tag="div"
      :list="column.cards"
      :group="'cards'"         
      item-key="id"
      animation="180"
      ghost-class="ghost"
      chosen-class="chosen"
      drag-class="dragging"
      class="list"
      @add="syncStatus"
    >
      <template #item="{ element }">
        <BaseKanbanCard
          :card="element"
          @edit="openDlg"
          @delete="deleteCard"
        />
      </template>
    </draggable>

    <!-- 统一弹窗 -->
    <Teleport to="body">
      <CardDialog
        v-if="dlgOpen"
        v-model:open="dlgOpen"
        :column-id="column.id"
        :card-id="editingId"
      />
    </Teleport>
  </a-card>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { ref, h, computed } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import BaseKanbanCard from './BaseKanbanCard.vue';
import CardDialog     from './CardDialog.vue';
import { useKanban }  from '../store/kanban';
import type { Column, Card } from '../store/kanban';

const props  = defineProps<{ column: Column }>();
const kanban = useKanban();

/* ---------- 拖到本列后把 status 改列名 ---------- */
function syncStatus(evt:any){
  const moved:Card|undefined = evt.item.__draggable_context?.element;
  if(moved) kanban.updateCard(props.column.id, moved.id, { status: props.column.name });
}

/* ---------- 卡片弹窗 ---------- */
const dlgOpen   = ref(false);
const editingId = ref<string|null>(null);
function openDlg(card:Card){ editingId.value=card.id; dlgOpen.value=true; }
function deleteCard(card:Card){
  if(confirm('Delete this card?')) kanban.removeCard(props.column.id, card.id);
}

/* ---------- 列头 ---------- */
function rename(){
  const name = prompt('New column name', props.column.name) || '';
  if(name.trim()) kanban.renameColumn(props.column.id, name.trim());
}
const header = computed(()=>h('div',{class:'head'},[
  h('span',{class:'hammer'},'🔨'),
  `${props.column.name} (${props.column.cards.length})`,
  h(Dropdown,{
    overlay:h(Menu,null,{default:()=>[h(Menu.Item,{onClick:rename},'Rename')]}),
    trigger:['click'],
  },{default:()=>h(MoreOutlined,{style:'margin-left:4px'})}),
]));
</script>

<style scoped>
/* — 列卡片外观 — */
.kanban-column{
  width:340px;border-radius:20px;overflow:hidden;
  background:linear-gradient(180deg,#fafafa 0%,#f0f0f0 100%);
  box-shadow:0 2px 6px rgba(0,0,0,.1);
  transition:transform .15s;
}
.kanban-column:hover{ transform:translateY(-2px); }
.list{
  min-height:90px;padding:6px 4px 12px;
  display:flex;flex-direction:column;gap:6px;
}
.head{display:flex;align-items:center;gap:6px;font-weight:600;font-size:15px;}
.hammer{font-size:13px;}
</style>
