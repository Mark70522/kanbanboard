import { defineStore } from 'pinia';

export interface Card {
  id: string;
  title: string;
  description?: string;
}

export interface Column {
  id: string;
  name: string;
  cards: Card[];
}

export const useBoardStore = defineStore('board', {
  state: () => ({
    columns: [] as Column[],
  }),
  actions: {
    addColumn(name: string) {
      this.columns.push({ id: crypto.randomUUID(), name, cards: [] });
    },
    addCard(columnId: string, title: string) {
      const column = this.columns.find(c => c.id === columnId);
      if (column) column.cards.push({ id: crypto.randomUUID(), title });
    },
    moveCard(cardId: string, fromCol: string, toCol: string, newIdx: number) {
      const src = this.columns.find(c => c.id === fromCol);
      const dst = this.columns.find(c => c.id === toCol);
      if (!src || !dst) return;
      const idx = src.cards.findIndex(c => c.id === cardId);
      if (idx === -1) return;
      const [card] = src.cards.splice(idx, 1);
      dst.cards.splice(newIdx, 0, card);
    },
  },
});
