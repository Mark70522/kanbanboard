<template>
  <aside class="sidebar">
    <!-- 顶部：Logo + 新建 + 设置 -->
    <div class="top">
      <span class="logo">MPK</span>
      <div class="top-actions">
        <button class="add-btn" @click="dlg = true">＋</button>
        <a-dropdown placement="bottomRight">
          <template #overlay>
            <a-menu>
              <a-menu-item @click="openArchive">
                <span>Archive Document</span>
              </a-menu-item>
            </a-menu>
          </template>
          <a-tooltip title="Settings">
            <SettingOutlined class="tool-icon" />
          </a-tooltip>
        </a-dropdown>
      </div>
    </div>

    <!-- Board 列表 -->
    <ul class="boards">
      <li
        v-for="b in boards"
        :key="b.id"
        :class="{ active: b.id === currentId }"
        @click="kanban.switchBoard(b.id)"
      >
        <span class="dot">{{ boardInitial(b) }}</span>
        <span class="name">{{ b.name || 'Untitled' }}</span>
        <a-dropdown @click.stop>
          <MoreOutlined class="more" />
          <template #overlay>
            <a-menu>
              <a-menu-item @click.stop="rename(b)">Rename</a-menu-item>
              <a-menu-item danger @click.stop="remove(b)">Delete</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </li>
    </ul>

    <!-- 创建 Board -->
    <a-modal
      v-model:open="dlg"
      title="Create Board"
      ok-text="Create" cancel-text="Cancel"
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
import { MoreOutlined, SettingOutlined } from '@ant-design/icons-vue';

const kanban = useKanban();
const { boards, currentId } = kanban;

const boardInitial = (b:any)=>((b?.name ?? '').trim().slice(0,1) || '?').toUpperCase();

const dlg = ref(false);
const name = ref('');
function create(){
  const n = name.value.trim();
  if(!n) return;
  kanban.addBoard(n);
  name.value=''; dlg.value=false;
}
function rename(b:any){
  const n = prompt('Rename board', b.name) ?? '';
  if(n.trim()) kanban.renameBoard(b.id, n);
}
function remove(b:any){
  if(confirm(`Delete board “${b.name}” ?`)){
    kanban.removeBoard(b.id);
  }
}
function openArchive() {
  alert('打开归档文档功能（请在此处实现弹窗或页面跳转）');
}
</script>

<style scoped>
.sidebar{
  width:220px;
  height:100vh;
  background:linear-gradient(180deg,#001529 80%,#1e293b 100%);
  color:#fff;
  display:flex;
  flex-direction:column;
  flex-shrink:0;
  box-shadow:2px 0 8px rgba(0,0,0,0.08);
}
.top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:18px 20px 10px;
  border-bottom:1px solid rgba(255,255,255,0.07);
}
.logo{
  font-size:22px;
  font-weight:900;
  letter-spacing:2px;
  color:#c4e27e;
  text-shadow:0 2px 8px #0002;
}
.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.add-btn{
  width:34px;
  height:34px;
  border:none;
  border-radius:50%;
  background:linear-gradient(135deg,#52c41a 60%,#73d13d 100%);
  color:#fff;
  font-size:24px;
  line-height:32px;
  cursor:pointer;
  box-shadow:0 2px 8px #0001;
  transition:background .2s,box-shadow .2s;
}
.add-btn:hover{
  background:linear-gradient(135deg,#73d13d 60%,#b7eb8f 100%);
  box-shadow:0 4px 12px #0002;
}
.tool-icon {
  font-size: 30px;
  color: #c4e27e;
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
  text-shadow:0 2px 8px #0003;
  margin-left: 2px;
}
.tool-icon:hover {
  color: #fff176;
  text-shadow:0 4px 16px #c4e27e55;
}

.boards{
  flex:1;
  margin:8px 0 0 0;
  padding:0 10px;
  list-style:none;
  display:flex;
  flex-direction:column;
  gap:8px;
  overflow:auto;
}
.boards li{
  display:flex;
  align-items:center;
  gap:10px;
  padding:8px 10px;
  border-radius:8px;
  cursor:pointer;
  transition:background .15s,box-shadow .15s;
  background:transparent;
}
.boards li.active{
  background:rgba(196,226,126,0.18);
  box-shadow:0 2px 8px #c4e27e22;
}
.boards li:hover{
  background:rgba(255,255,255,.08);
}
.dot{
  width:30px;
  height:30px;
  line-height:30px;
  text-align:center;
  border-radius:50%;
  background:linear-gradient(135deg,#c4e27e 60%,#eaff8f 100%);
  color:#001529;
  font-weight:700;
  font-size:16px;
  flex-shrink:0;
  box-shadow:0 2px 8px #c4e27e33;
}
.name{
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  flex:1;
  font-size:15px;
  font-weight:500;
  letter-spacing:1px;
}

.more{
  font-size:18px;
  color:#ffffff80;
  cursor:pointer;
  margin-left:auto;
  transition:color .15s;
}
.more:hover{
  color:#c4e27e;
}
</style>