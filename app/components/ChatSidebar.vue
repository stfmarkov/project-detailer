<script setup lang="ts">
import type { IConversationListItem } from '../../server/models/Conversation'

const projectId = useRoute().params.projectId
const route = useRoute()
const conversations = ref<IConversationListItem[]>([])
const router = useRouter()

// Editing state
const editingId = ref<string | null>(null)
const editingTitle = ref('')

const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
}

const fetchConversations = async () => {
    conversations.value = await $fetch<IConversationListItem[]>(`/api/getConversations?projectId=${projectId}`)
}

const createNewConversation = () => {
    if (!projectId) return
    router.push(`/project-${projectId.toString()}/chat`)
}

const startEditing = (conversation: IConversationListItem, event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    editingId.value = conversation.conversationId
    editingTitle.value = conversation.title
}

const cancelEditing = () => {
    editingId.value = null
    editingTitle.value = ''
}

const saveTitle = async (conversationId: string, event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!editingTitle.value.trim()) {
        cancelEditing()
        return
    }

    try {
        await $fetch('/api/updateConversation', {
            method: 'POST',
            body: { conversationId, title: editingTitle.value }
        })
        await fetchConversations()
    } catch (error) {
        console.error('Failed to update title:', error)
    }
    cancelEditing()
}

const deleteConversation = async (conversationId: string, event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!confirm('Delete this conversation?')) return

    try {
        await $fetch('/api/deleteConversation', {
            method: 'POST',
            body: { conversationId }
        })
        
        // If we're viewing the deleted conversation, navigate away
        if (route.query.id === conversationId) {
            router.push(`/project-${projectId}/chat`)
        }
        
        await fetchConversations()
    } catch (error) {
        console.error('Failed to delete conversation:', error)
    }
}

const archivingId = ref<string | null>(null)

const archiveConversation = async (conversationId: string, event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!confirm('Extract insights to Context and delete this conversation?')) return

    archivingId.value = conversationId

    try {
        const result = await $fetch<{ message: string; data: { contexts: Array<{ title: string }> } }>('/api/extractConversationContext', {
            method: 'POST',
            body: { conversationId, deleteAfter: true }
        })
        
        alert(result.message)
        
        // If we're viewing the archived conversation, navigate away
        if (route.query.id === conversationId) {
            router.push(`/project-${projectId}/chat`)
        }
        
        await fetchConversations()
    } catch (error: any) {
        console.error('Failed to archive conversation:', error)
        alert(error.data?.statusMessage || 'Failed to archive conversation')
    } finally {
        archivingId.value = null
    }
}

onMounted(fetchConversations)
</script>

<template>
    <div class="chat-sidebar">
        <div class="sidebar-header">
            <h2>Conversations</h2>
            <button class="new-chat-btn" title="New conversation" @click="createNewConversation">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>

        <div class="conversations-list" v-if="conversations.length > 0">
            <div 
                class="conversation-item-wrapper" 
                v-for="conversation in conversations" 
                :key="conversation._id"
            >
                <!-- Editing mode -->
                <div v-if="editingId === conversation.conversationId" class="conversation-item editing">
                    <input 
                        v-model="editingTitle"
                        type="text"
                        class="edit-input"
                        @keyup.enter="saveTitle(conversation.conversationId, $event)"
                        @keyup.escape="cancelEditing"
                        @click.stop
                        ref="editInput"
                        autofocus
                    />
                    <div class="edit-actions">
                        <button class="action-btn save" @click="saveTitle(conversation.conversationId, $event)" title="Save">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </button>
                        <button class="action-btn cancel" @click.stop="cancelEditing" title="Cancel">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Normal mode -->
                <NuxtLink 
                    v-else
                    class="conversation-item" 
                    :to="`/project-${projectId}/chat?id=${conversation.conversationId}`"
                >
                    <div class="conversation-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div class="conversation-info">
                        <span class="conversation-title">{{ conversation.title }}</span>
                        <span class="conversation-date">{{ formatDate(conversation.createdAt) }}</span>
                    </div>
                    <div class="conversation-actions">
                        <button 
                            class="action-btn archive" 
                            :class="{ 'loading': archivingId === conversation.conversationId }"
                            @click="archiveConversation(conversation.conversationId, $event)" 
                            title="Archive to Context"
                            :disabled="archivingId === conversation.conversationId"
                        >
                            <svg v-if="archivingId !== conversation.conversationId" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="21 8 21 21 3 21 3 8" />
                                <rect x="1" y="3" width="22" height="5" />
                                <line x1="10" y1="12" x2="14" y2="12" />
                            </svg>
                            <span v-else class="spinner"></span>
                        </button>
                        <button class="action-btn edit" @click="startEditing(conversation, $event)" title="Rename">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        <button class="action-btn delete" @click="deleteConversation(conversation.conversationId, $event)" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <div class="empty-state" v-else>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No conversations yet</p>
            <span>Start chatting to create one</span>
        </div>
    </div>
</template>

<style scoped>
.chat-sidebar {
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-header h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #e0e0e0;
    margin: 0;
}

.new-chat-btn {
    background: rgba(233, 69, 96, 0.15);
    border: 1px solid rgba(233, 69, 96, 0.3);
    color: #e94560;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.new-chat-btn:hover {
    background: rgba(233, 69, 96, 0.25);
}

.conversations-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.conversation-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
}

.conversation-item:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
}

.conversation-item:hover .conversation-actions {
    opacity: 1;
}

.conversation-item.editing {
    background: rgba(255, 255, 255, 0.06);
    border-color: #e94560;
}

.conversation-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.action-btn {
    background: transparent;
    border: none;
    padding: 0.35rem;
    border-radius: 4px;
    cursor: pointer;
    color: #707080;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e0e0e0;
}

.action-btn.delete:hover {
    background: rgba(255, 71, 87, 0.15);
    color: #ff4757;
}

.action-btn.save {
    color: #2ed573;
}

.action-btn.save:hover {
    background: rgba(46, 213, 115, 0.15);
}

.action-btn.cancel:hover {
    background: rgba(255, 71, 87, 0.15);
    color: #ff4757;
}

.action-btn.archive:hover {
    background: rgba(46, 213, 115, 0.15);
    color: #2ed573;
}

.action-btn.loading {
    cursor: wait;
    opacity: 0.7;
}

.action-btn:disabled {
    pointer-events: none;
}

.spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: #2ed573;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.edit-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 0.4rem 0.6rem;
    color: #e0e0e0;
    font-size: 0.875rem;
    outline: none;
}

.edit-input:focus {
    border-color: #e94560;
}

.edit-actions {
    display: flex;
    gap: 0.25rem;
}

.conversation-icon {
    color: #707080;
    flex-shrink: 0;
}

.conversation-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.conversation-title {
    color: #e0e0e0;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.conversation-date {
    color: #505060;
    font-size: 0.75rem;
}

.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #505060;
    text-align: center;
    padding: 2rem;
}

.empty-state svg {
    opacity: 0.5;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #707080;
    font-size: 0.9rem;
    margin: 0;
}

.empty-state span {
    font-size: 0.8rem;
}

/* Custom scrollbar */
.conversations-list::-webkit-scrollbar {
    width: 4px;
}

.conversations-list::-webkit-scrollbar-track {
    background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.conversations-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>