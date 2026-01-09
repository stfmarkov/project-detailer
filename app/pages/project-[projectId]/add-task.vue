<script setup lang="ts">
import MainButton from '@/components/MainButton.vue'
import { useTasksStore } from '@/store/tasks'
import { useProjectsStore } from '@/store/projects'

definePageMeta({
  layout: 'project'
})

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const router = useRouter()

const route = useRoute()
const project = computed(() => projectsStore.currentProject)

const projectId = computed(() => route.params.projectId as string)
const taskId = computed(() => route.query.taskId as string)

const task = computed(() => tasksStore.task)

const form = reactive({
  projectId: projectId.value,
  title: '',
  description: ''
})

const isSubmitting = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const isEditMode = computed(() => !!taskId.value)
const pageTitle = computed(() => isEditMode.value ? 'Edit Task' : 'Add Task')
const buttonText = computed(() => isEditMode.value ? 'Save Changes' : 'Create Task')

const addTask = async () => {
  await tasksStore.addTask(form)
  message.value = { type: 'success', text: 'Task created successfully!' }
  form.title = ''
  form.description = ''
  
  // Navigate back to tasks list after short delay
  setTimeout(() => {
    router.push(`/project-${projectId.value}/tasks`)
  }, 1000)
}

const editTask = async () => {
  if (!taskId.value) {
    message.value = { type: 'error', text: 'Task ID is required' }
    return
  }

  await tasksStore.editTask({ 
    taskId: taskId.value, 
    title: form.title, 
    description: form.description 
  })

  message.value = { type: 'success', text: 'Task updated successfully!' }
  
  // Navigate back to tasks list after short delay
  setTimeout(() => {
    router.push(`/project-${projectId.value}/tasks`)
  }, 1000)
}

const handleSubmit = async () => {
  if (!form.title.trim()) {
    message.value = { type: 'error', text: 'Title is required' }
    return
  }

  isSubmitting.value = true
  message.value = null

  try {
    if (isEditMode.value) {
      await editTask()
    } else {
      await addTask()
    }
  } catch (error: any) {
    message.value = { 
      type: 'error', 
      text: error.data?.statusMessage || 'Failed to save task' 
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await projectsStore.getProject(projectId.value)
  
  if (taskId.value) {
    await tasksStore.getTask(taskId.value)
    form.title = task.value?.title || ''
    form.description = task.value?.description || ''
  }
})
</script>

<template>
  <ProjectHeader 
    :title="project?.title || 'Project Detailer'" 
    :subtitle="pageTitle" 
  />

  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="e.g., Implement login page, Write chapter 3, Design character sprite"
        :disabled="isSubmitting"
      />
    </div>

    <div class="field">
      <label for="description">Description <span class="optional">(optional)</span></label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        placeholder="Add any details, requirements, or notes about this task..."
        :disabled="isSubmitting"
      />
    </div>

    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        class="cancel-btn" 
        @click="router.push(`/project-${projectId}/tasks`)"
        :disabled="isSubmitting"
      >
        Cancel
      </button>
      <MainButton :disabled="isSubmitting || !form.title.trim()" @click="handleSubmit">
        <span v-if="isSubmitting">Saving...</span>
        <span v-else>{{ buttonText }}</span>
      </MainButton>
    </div>
  </form>
</template>

<style scoped>
.form {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  color: #e0e0e0;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.optional {
  color: #606070;
  font-weight: 400;
  font-size: 0.85rem;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #606070;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #e94560;
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
}

.field input:disabled,
.field textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.message.success {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  color: #2ed573;
}

.message.error {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #a0a0b0;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.3);
  color: #e0e0e0;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

