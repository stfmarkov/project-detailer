<script setup lang="ts">
import type { IContextPoint, IFile } from '../../../server/models/Context'

definePageMeta({
    layout: 'project'
})

const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.projectId as string)

const context = ref<IContextPoint[]>([] as IContextPoint[])
const files = ref<IFile[]>([] as IFile[])
const addContext = () => {
    router.push(`/project-${projectId.value}/add-context`)
}

const getContext = async () => {
    const response = await $fetch<{ data: { context: IContextPoint[], files: IFile[] } }>(`/api/getProjectContext?projectId=${projectId.value}`)
    context.value = response.data.context
    files.value = response.data.files
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

        <ContextPointBox v-for="contextItem in context" :key="contextItem._id.toString()" :contextItem="contextItem"
            @updateContext="getContext" />
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
    margin-bottom: 1rem;
}
</style>