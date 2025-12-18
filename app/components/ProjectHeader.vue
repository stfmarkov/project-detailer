<script setup lang="ts">
const props = defineProps<{
    title: string
    subtitle: string
}>()
</script>

<template>
    <header class="header">
        <h1>{{ props.title }}</h1>
        <p class="subtitle">{{ props.subtitle }}</p>
    </header>
</template>

<style>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.header h1 {
    color: #e94560;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
}

.subtitle {
    color: #a0a0b0;
    font-size: 0.95rem;
    margin: 0.25rem 0 0 0;
}
</style>