import type { IContext, IFile, IContextPoint } from '~~/server/models/Context'

interface ContextStoreState {
    context: IContext | null
    files: IFile[] | null
    contextItems: IContextPoint[] | null
}

export const useContextStore = defineStore('context', {
    state: (): ContextStoreState => ({
        context: null,
        files: null,
        contextItems: null
    }),
    actions: {
        async getContext(contextId: string) {
            this.context = await $fetch<IContext>(`/api/getContext?contextId=${contextId}`)
        },
        async addContext(context: { projectId: string, title: string, content: string }) {
            await $fetch('/api/addContext', {
                method: 'POST',
                body: context
            })
        },
        async editContext(context: { contextId: string, title: string, content: string }) {
            await $fetch('/api/editContext', {
                method: 'POST',
                body: context
            })
        },
        async getProjectContext(projectId: string) {
            const response = await $fetch<{ data: { context: IContextPoint[], files: IFile[] } }>(`/api/getProjectContext?projectId=${projectId}`)
            this.contextItems = response.data.context
            this.files = response.data.files
        }
    }
})