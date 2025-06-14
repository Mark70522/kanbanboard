<template>
  <aside class="sidebar">
    <!-- 顶部 Logo + 新建按钮 -->
    <div class="top">
      <span class="logo">MPK</span>
      <button class="add-btn" @click="dlg = true">＋</button>
    </div>

    <!-- Board 列表：首字母圆点 + 名称 -->
    <ul class="boards">
      <li
        v-for="b in boards"
        :key="b.id"
        :class="{ active: b.id === currentId }"
        @click="kanban.switchBoard(b.id)"
      >
        <span class="dot">{{ boardInitial(b) }}</span>
        <span class="name">{{ b.name || 'Untitled' }}</span>
      </li>
    </ul>

    <!-- 创建 Board 弹窗 -->
    <a-modal
      v-model:open="dlg"
      title="Create Board"
      ok-text="Create"
      cancel-text="Cancel"
      :mask-closable="false"
      @ok="create"
    >
      <a-input
        v-model:value="name"
        placeholder="Board name"
        @keyup.enter="create"
        allow-clear
      />
    </a-modal>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useKanban } from '../store/kanban';

/* -------- 拿到 pinia store -------- */
const kanban = useKanban();
const { boards, currentId } = kanban;    // 这里解构 → 模板里直接用

/* -------- 工具：安全取首字母 -------- */
function boardInitial(b: any) {
  const s = (b?.name ?? '').trim();
  return s ? s[0].toUpperCase() : '?';
}

/* -------- 新建 Board -------- */
const dlg  = ref(false);
const name = ref('');
function create() {
  const n = name.value.trim();
  if (!n) return;
  kanban.addBoard(n);
  name.value = '';
  dlg.value  = false;
}
</script>

<style scoped>
.sidebar{
  width:200px;height:100vh;background:#001529;color:#fff;
  display:flex;flex-direction:column;flex-shrink:0;
}
/* 顶部 */
.top{display:flex;align-items:center;justify-content:space-between;
     padding:12px 16px 8px;}
.logo{font-size:18px;font-weight:700;}
.add-btn{width:32px;height:32px;border:none;border-radius:50%;
         background:#52c41a;color:#fff;font-size:22px;line-height:30px;
         cursor:pointer;transition:background .2s;}
.add-btn:hover{background:#73d13d;}
/* 列表 */
.boards{flex:1;margin:8px 0;padding:0 8px;list-style:none;
        display:flex;flex-direction:column;gap:6px;overflow:auto;}
.boards li{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;
          cursor:pointer;transition:background .15s;}
.boards li.active{background:rgba(255,255,255,.15);}
.boards li:hover {background:rgba(255,255,255,.08);}
.dot{width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;
     background:#c4e27e;color:#001529;font-weight:600;flex-shrink:0;}
.name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
</style>
