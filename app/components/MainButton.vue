<script setup lang="ts">
const props = defineProps<{
    onClick: () => void
    disabled: boolean
}>()
</script>

<template>
    <button @click="props.onClick" class="main-button" :disabled="props.disabled">
        <slot/>
    </button>
</template>

<style scoped>
.main-button {
    padding: 1rem;
    background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
}

.main-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

.main-button:active:not(:disabled) {
    transform: translateY(0);
}

.main-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>