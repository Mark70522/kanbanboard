<template>
  <a-card :title="header" class="kanban-column" :body-style="{padding:'8px'}">
    <draggable
      tag="div"
      :list="column.cards"
      :group="'cards'"          <!-- 三列都写这个纯字符串 -->
      item-key="id"
      animation="120"
      class="list"
      @add="syncStatus"
    >
      <template #item="{ element }">
        <BaseKanbanCard
          :card="element"
          @edit="openDlg"
          @delete="delCard"
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

/* ---------- 拖到本列时，把 status 改为列名 ---------- */
function syncStatus(evt:any){
  const moved:Card|undefined = evt.item.__draggable_context?.element;
  if(moved) kanban.updateCard(props.column.id, moved.id, { status: props.column.name });
}

/* ---------- 编辑 / 删除 ---------- */
const dlgOpen   = ref(false);
const editingId = ref<string|null>(null);

function openDlg(card:Card){ editingId.value = card.id; dlgOpen.value = true; }
function delCard (card:Card){
  if(confirm('Delete this card?')) kanban.removeCard(props.column.id, card.id);
}

/* ---------- 只剩 Rename ---------- */
function rename(){
  const name = prompt('New column name', props.column.name) || '';
  if(name.trim()) kanban.renameColumn(props.column.id, name.trim());
}
const header = computed(()=>h('div',{class:'head'},[
  h('span',{class:'hammer'},'🔨'),
  `${props.column.name} (${props.column.cards.length})`,
  h(Dropdown,{ overlay:h(Menu,null,{default:()=>[
        h(Menu.Item,{onClick:rename},'Rename')
  ]}), trigger:['click'] },
    {default:()=>h(MoreOutlined,{style:'margin-left:4px'})}),
]));
</script>

<style scoped>
.kanban-column{width:340px;border-radius:48px;overflow:hidden;}
.list{min-height:80px;padding-bottom:4px;}
.head{display:flex;align-items:center;gap:4px;}
.hammer{font-size:12px;}
</style>