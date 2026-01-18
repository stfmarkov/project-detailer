<script setup lang="ts">
    import { Icon } from '@iconify/vue'

    const props = defineProps<{
        name: string
    }>()

    const icon = computed(() => {
        return props.name
    })
</script>

<template>
    <Icon :icon="icon" />
</template>