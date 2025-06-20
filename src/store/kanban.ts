import { defineStore } from 'pinia';
import { watch } from 'vue';

/* ---------- 三列模板 ---------- */
function makeDefaultColumns() {
  return [
    { id: crypto.randomUUID(), name: 'Not started', cards: [] },
    { id: crypto.randomUUID(), name: 'In progress', cards: [] },
    { id: crypto.randomUUID(), name: 'Done', cards: [] },
  ];
}

/* ---------- 读取存档时就补列 ---------- */
function normalizeState(raw: any) {
  if (!raw || !raw.boards) return null;
  raw.boards.forEach((b: any) => {
    if (!Array.isArray(b.columns) || b.columns.length === 0) {
      b.columns = makeDefaultColumns();
    }
  });
  return raw;
}


/* ---------- 类型 ---------- */
export interface Card {
 id: string;
  title: string;
  desc?: string;
  deadline?: string;
  status: string;
  labelIds: string[];
  date?: string; // 新增：归档时间
  boardId?: string;   // 新增：原先所在的 Board ID
}
export interface Column { id: string; name: string; cards: Card[] }
export interface Board { id: string; name: string; columns: Column[] }
interface State { boards: Board[]; currentId: string; archivedCards: Card[] }

/* ---------- Store ---------- */
export const useKanban = defineStore('kanban', {

  state: (): State => {
    const saved = normalizeState(JSON.parse(localStorage.getItem('mpk-boards') || 'null'));
    if (saved) {
      if (!saved.archivedCards) saved.archivedCards = [];
      return saved;
    }
    const def: Board = {
      id: crypto.randomUUID(),
      name: 'Default',
      columns: makeDefaultColumns(),
    };
    return { boards: [def], currentId: def.id, archivedCards: [] };
  },

  getters: {
    current(s) { return s.boards.find(b => b.id === s.currentId)!; },
  },

  actions: {
    /* -------- Board -------- */
    addBoard(name: string) {
      const b: Board = { id: crypto.randomUUID(), name, columns: makeDefaultColumns() };
      this.boards.push(b); this.currentId = b.id;
    },
    switchBoard(id: string) {
      if (this.boards.some(b => b.id === id)) this.currentId = id;
    },

    /* -------- Column (删除被禁) -------- */
    renameColumn(colId: string, name: string) {
      const col = this.current.columns.find(c => c.id === colId);
      if (col) col.name = name;
    },

    /* -------- Card -------- */
    addCard(colId: string, p: { title: string; desc?: string; deadline?: string }) {
      const col = this.current.columns.find(c => c.id === colId); if (!col) return;
      col.cards.push({ id: crypto.randomUUID(), status: col.name, labelIds: [], ...p });
    },
    updateCard(colId: string, cardId: string, patch: Partial<Card>) {
      const col = this.current.columns.find(c => c.id === colId);
      const card = col?.cards.find(c => c.id === cardId);
      if (card) Object.assign(card, patch);
    },
    removeCard(colId: string, cardId: string) {
      const col = this.current.columns.find(c => c.id === colId);
      if (col) col.cards = col.cards.filter(c => c.id !== cardId);
    },
    /*** ★★★ 新增：重命名 Board ★★★ */
    renameBoard(id: string, name: string) {
      const b = this.boards.find(b => b.id === id);
      if (b && name.trim()) {
        b.name = name.trim();
      }
    },

    removeBoard(id: string) {
      /* 找到要删的索引 */
      const idx = this.boards.findIndex(b => b.id === id);
      if (idx === -1) return;

      /* 1️⃣ 就地删除——splice 而不是重新赋值 */
      this.boards.splice(idx, 1);

      /* 2️⃣ 若删的是当前板 → 指向第一个（若存在） */
      if (this.currentId === id) {
        this.currentId = this.boards[0]?.id ?? '';
      }

      /* 3️⃣ 若所有板都删光，自动建一个默认板 */
      if (this.boards.length === 0) {
        const def = {
          id: crypto.randomUUID(),
          name: 'My Board',
          columns: makeDefaultColumns(),
        };
        this.boards.push(def);
        this.currentId = def.id;
      }
    },

    archiveCard(colId: string, cardId: string) {
      const col = this.current.columns.find(c => c.id === colId);
      if (!col) return;
      const idx = col.cards.findIndex(c => c.id === cardId);
      if (idx === -1) return;
      const [card] = col.cards.splice(idx, 1);

      // 记录归档时间和所在板块
      card.date    = new Date().toLocaleString();
      card.boardId = this.currentId;   // <— 这里赋值

      this.archivedCards.push(card);
    },
    // 恢复 Card
    restoreCard(cardId: string) {
      const idx = this.archivedCards.findIndex(c => c.id === cardId);
      if (idx === -1) return;
      const [card] = this.archivedCards.splice(idx, 1);

      // 切回原来的板块
      if (card.boardId) {
        this.currentId = card.boardId;   // <— 切板
      }

      // 放到该板的 Done 列
      const doneCol = this.current.columns.find(c => c.name === 'Done');
      if (doneCol) {
        card.status = 'Done';
        doneCol.cards.push(card);
      }
    },
  },
});

/* ---------- 持久化 ---------- */
export function initKanbanPersistence() {
  const kanban = useKanban();
  watch(() => kanban.$state,
    s => localStorage.setItem('mpk-boards', JSON.stringify(s)),
    { deep: true });
}
