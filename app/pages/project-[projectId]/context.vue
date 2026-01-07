<script setup lang="ts">
import type { IContext, IFile } from '../../../server/models/Context'

definePageMeta({
    layout: 'project'
})

const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.projectId as string)

const context = ref<IContext[]>([] as IContext[])
const files = ref<IFile[]>([] as IFile[])
const addContext = () => {
    router.push(`/project-${projectId.value}/add-context`)
}

const getContext = async () => {
    const response = await $fetch<{ data: { context: IContext[], files: IFile[] } }>(`/api/getProjectContext?projectId=${projectId.value}`)
    context.value = response.data.context
    files.value = response.data.files
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

const clearFile = async (id?: string) => {
    await $fetch(`/api/deleteFileContext?fileId=${id}`, {
        method: 'DELETE',
        body: {
            fileId: id
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
        <FileBox v-for="file in files" :file="{ name: file.fileName, id: file.fileId }" @clearFile="clearFile" />

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
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .context-item {
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
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