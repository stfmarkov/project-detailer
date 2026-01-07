<script setup lang="ts">
import { useGlobalStore } from '../store/global'

const globalStore = useGlobalStore()
const drawerChild = computed(() => globalStore.drawerChild)

const drawerComponents = {
    ChatSidebar: defineAsyncComponent(() => import('./ChatSidebar.vue'))
}

const drawerComponent = computed(() => drawerComponents[drawerChild.value as keyof typeof drawerComponents])

const isOpen = ref(false)
const switchDrawer = () => {
    console.log('switchDrawer')
    isOpen.value = !isOpen.value
}
</script>

<template>
    <div v-if="drawerComponent" class="drawer-menu" :class="{ 'drawer-menu--open': isOpen }">
        <div class="drawer-menu__switch" @click="switchDrawer">
        </div>
        <component :is="drawerComponent" />
    </div>
</template>

<style scoped>
.drawer-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: #1a1a2e;
    color: #fff;
    z-index: 100;
    opacity: 0.85;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
}

.drawer-menu--open {
    transform: translateX(0);
}

.drawer-menu__switch {
    position: absolute;
    opacity: 0.98;
    top: 20px;
    left: -20px;
    width: 20px;
    height: 20px;
    background-color: #1a1a2e;
    z-index: 100;
    cursor: pointer;
    border-radius: 10px 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>