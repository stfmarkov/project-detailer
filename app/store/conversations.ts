import type { IConversation, IConversationListItem } from "~~/server/models/Conversation"
import { handleRequest } from "./utils/handleRequest"

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
            const conversations = await handleRequest(
                () => $fetch<IConversationListItem[]>('/api/getConversations', {
                query: { projectId }
            }), { showToast: false })
            if (conversations) {
                this.conversations = conversations
            }
        },
        async getConversation(conversationId: string) {
            const conversation = await handleRequest(() => $fetch<IConversation>('/api/getConversation', {
                query: { conversationId }
            }), { showToast: false })
            if (conversation) {
                this.conversation = conversation
            }
        },
        async sendMessage(projectId: string, question: string, conversationId: string) {
            return await handleRequest(() => $fetch<{ answer: string, sources: Array<{ title: string; score: number }> }>('/api/chat', {
                method: 'POST',
                body: { projectId, question, conversationId }
            }))
        },  
        async updateConversation(conversationId: string, title: string) {
            return await handleRequest(() => $fetch('/api/updateConversation', {
                method: 'POST',
                body: { conversationId, title }
            }))
        },
        async deleteConversation(conversationId: string) {
            return await handleRequest(() => $fetch('/api/deleteConversation', {
                method: 'POST',
                body: { conversationId }
            }))
        },
        clearConversation() {
            this.conversation = null
        },
        clearConversations() {
            this.conversations = []
        },
        async extractConversationContext(conversationId: string, deleteAfter: boolean) {
            return await handleRequest(() => $fetch<{ message: string; data: { contexts: Array<{ title: string }> } }>('/api/extractConversationContext', {
                method: 'POST',
                body: { conversationId, deleteAfter }
            }))
        }
    }
})