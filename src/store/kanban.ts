import { defineStore } from 'pinia';
import { watch } from 'vue';

/* ---------- 三列模板 ---------- */
function makeDefaultColumns() {
  return [
    { id: crypto.randomUUID(), name: 'Not started',  cards: [] },
    { id: crypto.randomUUID(), name: 'In progress', cards: [] },
    { id: crypto.randomUUID(), name: 'Done',        cards: [] },
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
export interface Card { id:string; title:string; desc?:string;
  deadline?:string; status:string; labelIds:string[] }
export interface Column{ id:string; name:string; cards:Card[] }
export interface Board { id:string; name:string; columns:Column[] }
interface State        { boards:Board[]; currentId:string }

/* ---------- Store ---------- */
export const useKanban = defineStore('kanban', {
  state: (): State => {
    /* ① 尝试读取存档并修复 */
    const saved = normalizeState(JSON.parse(localStorage.getItem('mpk-boards')||'null'));
    if (saved) return saved;

    /* ② 首次启动：创建默认 Board + 3 列 */
    const def:Board = {
      id: crypto.randomUUID(),
      name: 'Default',
      columns: makeDefaultColumns(),
    };
    return { boards:[def], currentId:def.id };
  },

  getters:{
    current(s){ return s.boards.find(b=>b.id===s.currentId)!; },
  },

  actions:{
    /* -------- Board -------- */
    addBoard(name:string){
      const b:Board = { id:crypto.randomUUID(), name, columns:makeDefaultColumns() };
      this.boards.push(b); this.currentId = b.id;
    },
    switchBoard(id:string){
      if (this.boards.some(b=>b.id===id)) this.currentId = id;
    },

    /* -------- Column (删除被禁) -------- */
    renameColumn(colId:string,name:string){
      const col=this.current.columns.find(c=>c.id===colId);
      if(col) col.name=name;
    },

    /* -------- Card -------- */
    addCard(colId:string,p:{title:string;desc?:string;deadline?:string}){
      const col=this.current.columns.find(c=>c.id===colId); if(!col) return;
      col.cards.push({ id:crypto.randomUUID(), status:col.name, labelIds:[], ...p });
    },
    updateCard(colId:string,cardId:string,patch:Partial<Card>){
      const col=this.current.columns.find(c=>c.id===colId);
      const card=col?.cards.find(c=>c.id===cardId);
      if(card) Object.assign(card,patch);
    },
    removeCard(colId:string,cardId:string){
      const col=this.current.columns.find(c=>c.id===colId);
      if(col) col.cards = col.cards.filter(c=>c.id!==cardId);
    },
  },
});

/* ---------- 持久化 ---------- */
export function initKanbanPersistence(){
  const kanban = useKanban();
  watch(()=>kanban.$state,
        s=>localStorage.setItem('mpk-boards',JSON.stringify(s)),
        {deep:true});
}
