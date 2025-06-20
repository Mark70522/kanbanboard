<template>
  <aside class="sidebar">
    <!-- 顶部：Logo + 新建 + 设置 -->
    <div class="top">
      <span class="logo">MPK</span>
      <div class="top-actions">
        <button class="add-btn" @click="dlg = true">＋</button>
        <a-dropdown placement="bottomRight">
          <a-tooltip title="Archive">
            <CiOutlined class="tool-icon" @click="openArchiveModal" />
          </a-tooltip>
        </a-dropdown>
      </div>
    </div>

    <!-- Board 列表 -->
    <ul class="boards">
      <li v-for="b in boards" :key="b.id" :class="{ active: b.id === currentId }" @click="kanban.switchBoard(b.id)">
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
    <a-modal v-model:open="dlg" title="Create Board" ok-text="Create" cancel-text="Cancel" :mask-closable="false"
      @ok="create">
      <a-input v-model:value="name" placeholder="Board name" @keyup.enter="create" allow-clear />
    </a-modal>

 <a-modal
      v-model:open="showArchiveModal"
      title="history archive documents"
      width="600px"
      :footer="null"
      @cancel="showArchiveModal = false"
    >
          <!-- 搜索与排序 -->
      <div class="search-sort">
        <a-input
          v-model:value="searchText"
          placeholder="Search archives"
          allow-clear
          class="search-input"
        />
        <a-select v-model:value="sortOrder" placeholder="Sort by deadline" class="sort-select">
          <a-select-option value="asc">asc</a-select-option>
          <a-select-option value="desc">desc</a-select-option>
        </a-select>
      </div>
      <div v-if="archiveList.length === 0" class="empty">
        no archive documents
      </div>
      <a-list
        v-else
        :data-source="archiveList"
        bordered
        size="small"
        style="max-height:300px;overflow:auto;"
      >
        <template #renderItem="{ item }">
          <a-list-item @click="viewArchive(item)">
            <a-list-item-meta
              :title="item.title || item.id"
              :description="item.date || ''"
            />
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
    <!-- 存档详情弹窗 -->
    <a-modal
      v-model:open="showArchiveDetail"
      title="archive details"
      width="800px"
      @cancel="onClose"
    >
      <div v-if="selectedArchive">
        <div v-for="(value, key) in selectedArchive" :key="key" class="detail-item">
          <span class="detail-key">{{ key }}:</span>
          <span class="detail-value">{{ value || '无内容' }}</span>
        </div>
      </div>
      <template #footer>
        <a-button @click="onClose">Close</a-button>
        <a-button type="primary" @click="restoreArchive">Restore</a-button>
      </template>
    </a-modal>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { useKanban } from '../store/kanban';
import { MoreOutlined, CiOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

interface ArchiveItem {
  id: string;
  title?: string;
  desc?: string;
  date?: string;
  deadline?: string;
}

const kanban = useKanban();
const { boards, currentId } = kanban;

const boardInitial = (b: any) => ((b?.name ?? '').trim().slice(0, 1) || '?').toUpperCase();

const dlg = ref(false);
const name = ref('');
function create() {
  const n = name.value.trim();
  if (!n) return;
  kanban.addBoard(n);
  name.value = ''; dlg.value = false;
}
function rename(b: any) {
  const n = prompt('Rename board', b.name) ?? '';
  if (n.trim()) kanban.renameBoard(b.id, n);
}
function remove(b: any) {
  if (confirm(`Delete board “${b.name}” ?`)) {
    kanban.removeBoard(b.id);
  }
}
const showArchiveModal = ref(false);
function openArchiveModal() {
  showArchiveModal.value = true;
}
function closeArchiveModal() {
  showArchiveModal.value = false;
}


// 归档列表、搜索和排序
const searchText = ref('');
const sortOrder = ref<'asc'|'desc'>('asc');
const archiveList = computed<ArchiveItem[]>(() =>
  (kanban.archivedCards ?? []).map(card => ({ ...card, date: card.date || card.deadline || '' }))
);
const filteredList = computed(() => {
  return archiveList.value
    .filter(item =>
      [item.title, item.desc]
        .filter(Boolean)
        .some(str => str!.toLowerCase().includes(searchText.value.toLowerCase()))
    )
    .sort((a, b) => {
      const da = a.deadline ? Date.parse(a.deadline) : 0;
      const db = b.deadline ? Date.parse(b.deadline) : 0;
      return sortOrder.value === 'asc' ? da - db : db - da;
    });
});

// 归档相关
const selectedArchive = ref<ArchiveItem | null>(null);
const showArchiveDetail = computed({
  get: () => !!selectedArchive.value,
  set: (val: boolean) => { if (!val) selectedArchive.value = null; }
});

function viewArchive(item: ArchiveItem) {
  selectedArchive.value = item;
}
function onClose() {
  showArchiveDetail.value = false;
}
function restoreArchive() {
  if (selectedArchive.value) {
    kanban.restoreCard(selectedArchive.value.id);
    showArchiveDetail.value = false;
  }
}

// 用于 a-list 的 renderItem，带类型
function renderArchiveItem(item: ArchiveItem) {
  return h(
    'div',
    {
      class: 'archive-item',
      onClick: () => viewArchive(item)
    },
    [
      h('span', item.title || item.id),
      h('span', { style: 'color:#999;font-size:12px;margin-left:auto;' }, item.date || '')
    ]
  );
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background: linear-gradient(180deg, #001529 80%, #1e293b 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.logo {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #c4e27e;
  text-shadow: 0 2px 8px #0002;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #52c41a 60%, #73d13d 100%);
  color: #fff;
  font-size: 24px;
  line-height: 32px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0001;
  transition: background .2s, box-shadow .2s;
}

.add-btn:hover {
  background: linear-gradient(135deg, #73d13d 60%, #b7eb8f 100%);
  box-shadow: 0 4px 12px #0002;
}

.tool-icon {
  font-size: 30px;
  color: #c4e27e;
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
  text-shadow: 0 2px 8px #0003;
  margin-left: 2px;
}

.tool-icon:hover {
  color: #fff176;
  text-shadow: 0 4px 16px #c4e27e55;
}

.boards {
  flex: 1;
  margin: 8px 0 0 0;
  padding: 0 10px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
}

.boards li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background .15s, box-shadow .15s;
  background: transparent;
}

.boards li.active {
  background: rgba(196, 226, 126, 0.18);
  box-shadow: 0 2px 8px #c4e27e22;
}

.boards li:hover {
  background: rgba(255, 255, 255, .08);
}

.dot {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #c4e27e 60%, #eaff8f 100%);
  color: #001529;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px #c4e27e33;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
}

.more {
  font-size: 18px;
  color: #ffffff80;
  cursor: pointer;
  margin-left: auto;
  transition: color .15s;
}

.more:hover {
  color: #c4e27e;
}

.archive-item {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.15s;
}

.archive-item:hover {
  background: #f6ffed;
  color: #52c41a;
}
</style>