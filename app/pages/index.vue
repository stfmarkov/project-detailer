<script setup lang="ts">
import type { IProject } from '../../server/models/Project'
import { useRouter } from 'vue-router'
import MainButton from '@/components/MainButton.vue'

definePageMeta({
  layout: 'project'
})

const router = useRouter()
const projects = ref<IProject[]>([])

onMounted(async () => {
  projects.value = await $fetch<IProject[]>('/api/getAllProjects')
})

const createProject = () => {
  router.push('/new-project')
}

</script>

<template>
  <ProjectHeader title="Projects" subtitle="Manage your projects" />
  
  <div class="projects-page">
    <div v-if="projects.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <h3>No projects yet</h3>
      <p>Create your first project to start building your knowledge base</p>
      <MainButton :disabled="false" @click="createProject">+ Create Project</MainButton>
    </div>

    <div v-else class="projects-container">
      <div class="projects-header">
        <span class="project-count">{{ projects.length }} project{{ projects.length !== 1 ? 's' : '' }}</span>
        <MainButton :disabled="false" @click="createProject">+ New Project</MainButton>
      </div>
      
      <div class="projects-grid">
        <NuxtLink 
          v-for="project in projects" 
          :key="project._id.toString()"
          :to="`/project-${project._id.toString()}`"
          class="project-card"
        >
          <div class="project-icon">📋</div>
          <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
            <span class="project-category">{{ project.category }}</span>
          </div>
          <div class="project-arrow">→</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  max-width: 800px;
  margin: 0 auto;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-state h3 {
  color: #e0e0e0;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #808090;
  font-size: 1rem;
  margin: 0 0 2rem 0;
  max-width: 300px;
}

/* Projects List */
.projects-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-count {
  color: #808090;
  font-size: 0.9rem;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
}

.project-card:hover {
  border-color: rgba(233, 69, 96, 0.4);
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.project-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(233, 69, 96, 0.1);
  border-radius: 10px;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-title {
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-category {
  color: #e94560;
  font-size: 0.85rem;
  background: rgba(233, 69, 96, 0.15);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.project-arrow {
  color: #606070;
  font-size: 1.2rem;
  transition: color 0.2s, transform 0.2s;
}

.project-card:hover .project-arrow {
  color: #e94560;
  transform: translateX(4px);
}
</style>