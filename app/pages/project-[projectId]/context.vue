<script setup lang="ts">
import type { IContext } from '../../../server/models/Context'

definePageMeta({
    layout: 'project'
})

const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.projectId as string)

const context = ref<IContext[]>([] as IContext[])

const addContext = () => {
    router.push(`/project-${projectId.value}/add-context`)
}

const getContext = async () => {
    const response = await $fetch<{ data: IContext[] }>(`/api/getProjectContext?projectId=${projectId.value}`)
    context.value = response.data
}

const editContext = (contextId: string) => {
    router.push(`/project-${projectId.value}/add-context?contextId=${contextId}`)
}

const deleteContext = async (contextId: string) => {
    await $fetch(`/api/deleteContext?contextId=${contextId}`, {
        method: 'DELETE',
        body: {
            contextId: contextId
        }
    })
    getContext()
}

onMounted(async () => {
    getContext()
})

</script>

<template>
    <ProjectHeader title="Context" subtitle="Manage your context" />

    <div class="context-page">
        <div v-for="contextItem in context" :key="contextItem._id.toString()" class="context-item">
            <h3>{{ contextItem.title }}</h3>
            <p>{{ contextItem.content }}</p>

            <div class="context-page__actions"> 
                <MainButton :disabled="false" @click="editContext(contextItem._id.toString())">Edit</MainButton>
                <MainButton :disabled="false" @click="deleteContext(contextItem._id.toString())">Delete</MainButton>
            </div>

        </div>
    </div>

    <MainButton :disabled="false" @click="addContext">+ Add Context</MainButton>
</template>

<style scoped>
    .context-page {
        max-width: 800px;
        margin: 0 auto;
    }

    .context-item {
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }

    .context-item h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #e0e0e0;
    }

    .context-item p {
        font-size: 1rem;
        color: #808090;
    }
</style>