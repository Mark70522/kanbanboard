import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

/* 页面组件 */
import BoardPage from '@/pages/BoardPage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'board', component: BoardPage },
];

/* ✅ “export default …” 必须存在 */
export default createRouter({
  history: createWebHashHistory(),
  routes,
});
