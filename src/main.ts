import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(Antd)
  .mount('#app');