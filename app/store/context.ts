import type { IContext, IFile, IContextPoint } from '~~/server/models/Context'
import { handleRequest } from './utils/handleRequest'

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
            const context = await handleRequest(() => $fetch<IContext>(`/api/getContext?contextId=${contextId}`))
            if (context) {
                this.context = context
            }
        },
        async addContext(context: { projectId: string, title: string, content: string }) {
            return await handleRequest(() => $fetch('/api/addContext', {
                method: 'POST',
                body: context
            }))
        },
        async editContext(context: { contextId: string, title: string, content: string }) {
            return await handleRequest(() => $fetch('/api/editContext', {
                method: 'POST',
                body: context
            }))
        },
        async getProjectContext(projectId: string) {
            const response = await handleRequest(() => $fetch<{ data: { context: IContextPoint[], files: IFile[] } }>(`/api/getProjectContext?projectId=${projectId}`))
            if (response) {
                this.contextItems = response.data.context
                this.files = response.data.files
            }
        }
    }
})