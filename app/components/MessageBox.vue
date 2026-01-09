<script setup lang="ts">
const props = defineProps<{
    type: 'success' | 'error'
    message: string
}>()
</script>

<template>
    <div class="message" :class="type">{{ message }}</div>
</template>

<style scoped>
.message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.message.success {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  color: #2ed573;
}

.message.error {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
}
</style>