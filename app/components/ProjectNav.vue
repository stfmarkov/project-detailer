<script setup lang="ts">
const props = defineProps<{
    projectId: string
}>()

const route = useRoute()

const isChatPage = computed(() => route.path.includes('/chat'))
const isContextPage = computed(() => route.path.includes('/context'))
const isTasksPage = computed(() => route.path.includes('/tasks'))

const isProjectDetailsPage = computed(() => projectId.value && !isChatPage.value && !isContextPage.value && !isTasksPage.value)

const projectId = computed(() => route.params.projectId as string)

const chatLink = computed(() => `/project-${projectId.value}/chat`)
const addContextLink = computed(() => `/project-${projectId.value}/add-context`)

</script>

<template>
    <nav class="nav" v-if="projectId">

        <NuxtLink to="/" class="nav-link nav-link--projects">Projects</NuxtLink>
        <NuxtLink :to="`/project-${projectId}`" v-if="!isProjectDetailsPage" class="nav-link">Project Details</NuxtLink>
        <NuxtLink :to="`/project-${projectId}/context`" v-if="!isContextPage" class="nav-link">Context</NuxtLink>
        <NuxtLink :to="`/project-${projectId}/tasks`" v-if="!isTasksPage" class="nav-link">Tasks</NuxtLink>

        <NuxtLink v-if="!isChatPage" :to="chatLink" class="nav-link">Chat</NuxtLink>
        <NuxtLink v-if="isChatPage" :to="addContextLink" class="nav-link">+ Add Context</NuxtLink>
    </nav>
</template>

<style scoped>
.nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
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

.nav-link--projects {
    margin-right: auto;
    color: #e0e0e0;
    background: #e94560;
}

.nav-link:hover {
    background: rgba(233, 69, 96, 0.1);
}
</style>