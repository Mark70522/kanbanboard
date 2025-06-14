import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import draggable from 'vuedraggable';

import { initKanbanPersistence } from './store/kanban';

const app = createApp(App);
app.component('draggable', draggable);   // ★ 全局注册
const pinia = createPinia();

app.use(pinia).use(router).use(Antd);

initKanbanPersistence();   // ⚠️ Pinia.use() 之后再调用
app.mount('#app');
