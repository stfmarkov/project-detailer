import type { IConversation, IConversationListItem } from "~~/server/models/Conversation"

type ConversationsStoreState = {
    conversations: IConversationListItem[]
    conversation: IConversation | null
}
export const useConversationsStore = defineStore('conversations', {
    state: (): ConversationsStoreState => ({
        conversations: [],
        conversation: null
    }),
    actions: {
        async getConversations(projectId: string) {
            this.conversations = await $fetch<IConversationListItem[]>('/api/getConversations', {
                query: { projectId }
            })
        },
        async getConversation(conversationId: string) {
            this.conversation = await $fetch('/api/getConversation', {
                query: { conversationId }
            })
        },
        async sendMessage(projectId: string, question: string, conversationId: string) {
            return await $fetch<{ answer: string, sources: Array<{ title: string; score: number }> }>('/api/chat', {
                method: 'POST',
                body: { projectId, question, conversationId }
            })
        },  
        async updateConversation(conversationId: string, title: string) {
            await $fetch('/api/updateConversation', {
                method: 'POST',
                body: { conversationId, title }
            })
        },
        async deleteConversation(conversationId: string) {
            await $fetch('/api/deleteConversation', {
                method: 'POST',
                body: { conversationId }
            })
        },
        async extractConversationContext(conversationId: string, deleteAfter: boolean) {
            return await $fetch<{ message: string; data: { contexts: Array<{ title: string }> } }>('/api/extractConversationContext', {
                method: 'POST',
                body: { conversationId, deleteAfter }
            })
        }
    }
})