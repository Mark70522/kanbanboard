<template>
  <!-- v-model:open 绑定到脚本里的 open 变量 -->
  <a-modal
    v-model:open="open"
    :title="isEdit ? 'Edit Card' : 'Add Card'"
    @ok="handleOk"
    @cancel="open = false"
    destroy-on-close
  >
    <a-form layout="vertical">
      <a-form-item label="Title" required>
        <a-input v-model:value="draft.title" />
      </a-form-item>

      <a-form-item label="Description">
        <a-textarea v-model:value="draft.desc" :auto-size="{ minRows:3 }" />
      </a-form-item>

<a-form-item label="Priority">
  <a-select v-model:value="draft.priority" style="width: 100%">
    <a-select-option value="H">High</a-select-option>
    <a-select-option value="M">Medium</a-select-option>
    <a-select-option value="L">Low</a-select-option>
  </a-select>
</a-form-item>

      <a-form-item label="Deadline">
        <a-date-picker v-model:value="draft.deadline" style="width:100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
/* 👇 必要的 vue API 都要引入 */
import { reactive, watch, computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { useKanban } from '../store/kanban';

/* ====== ① 双向绑定 open ====== */
const open = defineModel<boolean>('open'); // <—— 核心修复行

/* ====== ② 普通 props ====== */
const props = defineProps<{
  columnId: string | null;
  cardId?: string | null;
}>();

const kanban = useKanban();

/* ====== ③ 编辑 / 新建 区分 ====== */
const isEdit = computed(() => !!props.cardId);

/* ====== ④ 表单草稿 ====== */
const draft = reactive<{
  priority: string;
  title: string;
  desc:  string;
  deadline?: Dayjs | string;
}>({ title: '', desc: '', priority: '',});

/* 弹窗打开时同步数据到 draft */
watch(
  () => open.value,
  (visible) => {
    if (!visible) return;
    if (isEdit.value && props.columnId && props.cardId) {
      const col  = kanban.current.columns.find(c => c.id === props.columnId);
      const card = col?.cards.find(c => c.id === props.cardId);
      if (card) {
        draft.priority    = card.priority || '';
        draft.title    = card.title;
        draft.desc     = card.desc || '';
        draft.deadline = card.deadline ? dayjs(card.deadline) : undefined;
      }
    } else {
       draft.priority = '';
      draft.title = '';
      draft.desc  = '';
      draft.deadline = undefined;
    }
  },
  { immediate: true },
);

/* ====== ⑤ 保存 ====== */
function handleOk() {
  if (!props.columnId || !draft.title.trim()) return;

  const payload = {
    priority: draft.priority.trim() || undefined,
    title: draft.title.trim(),
    desc:  draft.desc.trim(),
    deadline: draft.deadline ? (draft.deadline as Dayjs).format('YYYY-MM-DD') : undefined,
  };

  if (isEdit.value && props.cardId) {
    kanban.updateCard(props.columnId, props.cardId, payload);
  } else {
    kanban.addCard(props.columnId, payload);
  }
  open.value = false;  // 关闭弹窗
}
</script>
