import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import BoardPage from '../pages/BoardPage.vue';

const AboutPage = { template: '<div style="padding:24px">About page</div>' };

const routes: RouteRecordRaw[] = [
  { path: '/',     name: 'board', component: BoardPage },
  { path: '/about', name: 'about', component: AboutPage },
];

export default createRouter({ history: createWebHashHistory(), routes });
