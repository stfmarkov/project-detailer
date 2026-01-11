<script setup lang="ts">

import { useGlobalStore } from '@/store/global'

    const globalStore = useGlobalStore()

    const toast = computed(() => globalStore.toast)

</script>

<template>
    <div v-if="toast" class="toast" :class="toast?.type">
        <div class="toast-message" :class="toast?.type">{{ toast?.message }}</div>
    </div>
</template>

<style scoped>
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        border-radius: 5px;
        &.success {
            background-color: #008000;
        }
        &.error {
            background-color: #ff0000;
        }
        &.warning {
            background-color: #ffa500;
        }
    }
    .toast-message {
        color: #fff;
    }
</style>