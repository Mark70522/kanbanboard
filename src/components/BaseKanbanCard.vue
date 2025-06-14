<template>
  <a-card size="small" :title="card.title" class="kanban-card">
    <p>{{ card.description }}</p>
  </a-card>
</template>

<script setup lang="ts">
/* 这里仅用到类型，因此用 import type */
import type { Card } from '../store';

const props = defineProps<{ card: Card }>();
</script>

<style scoped>
.kanban-card {
  margin-bottom: 8px;
}
</style>
