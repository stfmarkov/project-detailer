<script setup lang="ts">
const props = defineProps<{
  projectId: string
}>()
</script>

<template>
    <div class="page">
        <div class="container">
            <slot />
        </div>
    </div>
</template>

<style>

</style>