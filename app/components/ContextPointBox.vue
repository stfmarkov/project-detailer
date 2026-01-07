<script setup lang="ts">
import type { IContextPoint } from '../../server/models/Context'

const emit = defineEmits<{
    (e: 'updateContext'): void
}>()

const props = defineProps<{
    contextItem: IContextPoint
}>()

const router = useRouter()
const route = useRoute()

const projectId = computed(() => route.params.projectId as string)

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
    emit('updateContext')
}

</script>

<template>
    <div :key="contextItem._id.toString()" class="context-item">
        <h3>{{ contextItem.title }}</h3>
        <p>{{ contextItem.content }}</p>

        <div class="context-page__actions">
            <MainButton :disabled="false" @click="editContext(contextItem._id.toString())">Edit</MainButton>
            <MainButton :disabled="false" @click="deleteContext(contextItem._id.toString())">Delete</MainButton>
        </div>

    </div>
</template>

<style scoped>
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

.context-page__actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}
</style>