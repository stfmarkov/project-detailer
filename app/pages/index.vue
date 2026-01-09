<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainButton from '@/components/MainButton.vue'
import { useProjectsStore } from '@/store/projects'

definePageMeta({
  layout: 'project'
})

const router = useRouter()

const projectsStore = useProjectsStore()
const projects = computed(() => projectsStore.projects)

onMounted(async () => {
  await projectsStore.fetchProjects()
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
        <ProjectListItem v-for="project in projects" :key="project._id.toString()" :project="project" />
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
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>