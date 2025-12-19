<script setup lang="ts">
import type { IProject } from '../../../server/models/Project'
import { useRoute } from 'vue-router'

const route = useRoute()

definePageMeta({
    layout: 'project'
})

const projectId = computed(() => route.params.projectId as string)
const projectTitle = ref('')

onMounted(async () => {
    const project = await $fetch<IProject>(`/api/getProject?projectId=${projectId.value}`)
    projectTitle.value = project.title
})

</script>

<template>
    <ProjectHeader :title="projectTitle || 'Loading...'" subtitle="Project Overview" />

    <div class="project-page">
        <!-- Quick Stats -->
        <div class="stats-row">
            <div class="stat-card">
                <span class="stat-icon">📄</span>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Context Entries</span>
                </div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">✅</span>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Tasks</span>
                </div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">💬</span>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Chat Sessions</span>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-section">
            <h3 class="section-title">Quick Actions</h3>
            <div class="actions-grid">
                <NuxtLink :to="`/project-${projectId}/add-context`" class="action-card">
                    <span class="action-icon">➕</span>
                    <div class="action-content">
                        <span class="action-title">Add Context</span>
                        <span class="action-desc">Add new information to your knowledge base</span>
                    </div>
                    <span class="action-arrow">→</span>
                </NuxtLink>
                
                <NuxtLink :to="`/project-${projectId}/context`" class="action-card">
                    <span class="action-icon">📚</span>
                    <div class="action-content">
                        <span class="action-title">View Context</span>
                        <span class="action-desc">Browse and manage existing entries</span>
                    </div>
                    <span class="action-arrow">→</span>
                </NuxtLink>
                
                <NuxtLink :to="`/project-${projectId}/chat`" class="action-card">
                    <span class="action-icon">💬</span>
                    <div class="action-content">
                        <span class="action-title">Chat</span>
                        <span class="action-desc">Ask questions about your project</span>
                    </div>
                    <span class="action-arrow">→</span>
                </NuxtLink>
                
                <NuxtLink :to="`/project-${projectId}/tasks`" class="action-card">
                    <span class="action-icon">✅</span>
                    <div class="action-content">
                        <span class="action-title">Tasks</span>
                        <span class="action-desc">View and manage project tasks</span>
                    </div>
                    <span class="action-arrow">→</span>
                </NuxtLink>
            </div>
        </div>

        <!-- Project Info -->
        <div class="info-section">
            <h3 class="section-title">Project Info</h3>
            <div class="info-card">
                <div class="info-row">
                    <span class="info-label">Project ID</span>
                    <span class="info-value mono">{{ projectId }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.project-page {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
}

.stat-icon {
    font-size: 1.5rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(233, 69, 96, 0.1);
    border-radius: 10px;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-value {
    color: #e0e0e0;
    font-size: 1.5rem;
    font-weight: 700;
}

.stat-label {
    color: #707080;
    font-size: 0.8rem;
}

/* Section Title */
.section-title {
    color: #a0a0b0;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 1rem 0;
}

/* Actions Grid */
.actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.action-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
}

.action-card:hover {
    border-color: rgba(233, 69, 96, 0.4);
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
}

.action-icon {
    font-size: 1.25rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(233, 69, 96, 0.1);
    border-radius: 8px;
    flex-shrink: 0;
}

.action-content {
    flex: 1;
    min-width: 0;
}

.action-title {
    display: block;
    color: #e0e0e0;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
}

.action-desc {
    display: block;
    color: #707080;
    font-size: 0.8rem;
}

.action-arrow {
    color: #606070;
    font-size: 1.1rem;
    transition: color 0.2s, transform 0.2s;
    flex-shrink: 0;
}

.action-card:hover .action-arrow {
    color: #e94560;
    transform: translateX(4px);
}

/* Info Section */
.info-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    overflow: hidden;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    color: #808090;
    font-size: 0.9rem;
}

.info-value {
    color: #e0e0e0;
    font-size: 0.9rem;
}

.info-value.mono {
    font-family: 'SF Mono', 'Consolas', monospace;
    color: #e94560;
    background: rgba(233, 69, 96, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 600px) {
    .stats-row {
        grid-template-columns: 1fr;
    }
    
    .actions-grid {
        grid-template-columns: 1fr;
    }
}
</style>