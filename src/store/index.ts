import { createPinia } from 'pinia';

/** 全局 Pinia 实例 —— 在 main.ts 里可直接 use(pinia) */
export const pinia = createPinia();

/** 重新导出各模块化 store，外部只需 `../store` 即可使用 */
export * from './board';
