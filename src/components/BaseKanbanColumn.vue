<template>
  <a-card :title="header" class="kanban-column" :body-style="{ padding: '10px 10px 14px' }">
    <draggable
      tag="div"
      :list="column.cards"
      :group="'cards'"
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
import CardDialog from './CardDialog.vue';
import { useKanban } from '../store/kanban';
import type { Column, Card } from '../store/kanban';

const props = defineProps<{ column: Column }>();
const kanban = useKanban();

function syncStatus(evt: any) {
  const moved: Card | undefined = evt.item.__draggable_context?.element;
  if (moved) kanban.updateCard(props.column.id, moved.id, { status: props.column.name });
}

const dlgOpen = ref(false);
const editingId = ref<string | null>(null);

function openDlg(card: Card) {
  editingId.value = card.id;
  dlgOpen.value = true;
}
function delCard(card: Card) {
  if (confirm('Delete this card?')) kanban.removeCard(props.column.id, card.id);
}

function rename() {
  const name = prompt('New column name', props.column.name) || '';
  if (name.trim()) kanban.renameColumn(props.column.id, name.trim());
}
const header = computed(() =>
  h('div', { class: 'head' }, [
    h('span', { class: 'hammer' }, '🔨'),
    `${props.column.name} (${props.column.cards.length})`,
    h(
      Dropdown,
      {
        overlay: h(Menu, null, { default: () => [h(Menu.Item, { onClick: rename }, 'Rename')] }),
        trigger: ['click'],
      },
      { default: () => h(MoreOutlined, { style: 'margin-left: 4px' }) },
    ),
  ]),
);
</script>

<style scoped>
.kanban-column{
  width:340px;border-radius:18px;overflow:hidden;

  /* 由白变柔灰渐变 */
  background:linear-gradient(180deg,#b1acac 0%,#b1acac 100%);
  box-shadow:0 2px 6px rgba(0,0,0,.06);
}

/* 列内列表保持间距 */
.list{
  min-height:90px;
  padding-bottom:6px;
  display:flex;flex-direction:column;gap:6px;
}

.head   {display:flex;align-items:center;gap:6px;font-weight:600;font-size:15px;}
.hammer {font-size:13px;}
</style>
