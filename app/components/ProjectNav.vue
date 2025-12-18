<script setup lang="ts">
const props = defineProps<{
    projectId: string
}>()

const route = useRoute()

const isChatPage = computed(() => route.path === '/chat')

</script>

<template>
    <nav class="nav">

        <NuxtLink to="/projects" class="nav-link">Projects</NuxtLink>

        <NuxtLink v-if="!isChatPage" to="/chat" class="nav-link">Chat</NuxtLink>
        <NuxtLink v-if="isChatPage" to="/" class="nav-link">+ Add Context</NuxtLink>
    </nav>
</template>

<style scoped>
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.nav-link {
    color: #e94560;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #e94560;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: background 0.2s;
}

.nav-link:hover {
    background: rgba(233, 69, 96, 0.1);
}
</style>