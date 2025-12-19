<script setup lang="ts">
const props = withDefaults(defineProps<{
    disabled?: boolean
    inactive?: boolean
    as?: 'div' | 'button',
    to?: string
}>(), {
    disabled: false,
    inactive: false,
    as: 'div',
    to: ''
})


const componentType = computed(() => {
    if (props.to) return resolveComponent('NuxtLink')
    return props.as
})

</script>

<template>
    <component :to="to" :is="componentType" class="card"
        :class="{ 'card--disabled': disabled, 'card--inactive': inactive }">
        <slot />
    </component>
</template>

<style scoped>
.card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    text-decoration: none;
    color: inherit;
}

.card:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
}

.card--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.card--disabled:hover {
    transform: none;
}

.card--inactive {
    opacity: 0.6;
}
</style>