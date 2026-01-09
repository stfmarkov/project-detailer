<script setup lang="ts">
import { useTasksStore } from '@/store/tasks'
import { useProjectsStore } from '@/store/projects'
import type { ITaskItem } from '~~/server/models/Task'

definePageMeta({
    layout: 'project'
})

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const router = useRouter()

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
const projectTitle = computed(() => projectsStore.currentProject?.title)

// Tasks state
const tasks = computed(() => tasksStore.tasks)
const isLoading = ref(true)

// Load project and tasks
onMounted(async () => {
    await projectsStore.getProject(projectId.value)
    await loadTasks()
})

async function loadTasks() {
    isLoading.value = true
    try {
        await tasksStore.getTasks(projectId.value)
    } catch (error) {
        console.error('Failed to load tasks:', error)
    } finally {
        isLoading.value = false
    }
}

// Navigate to add/edit page
function goToAddTask() {
    router.push(`/project-${projectId.value}/add-task`)
}

function goToEditTask(taskId: string) {
    router.push(`/project-${projectId.value}/add-task?taskId=${taskId}`)
}

// Toggle status
async function toggleStatus(task: ITaskItem) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
        await tasksStore.editTask({
            taskId: task._id.toString(),
            status: newStatus
        })
        await loadTasks()
    } catch (error) {
        console.error('Failed to update task status:', error)
    }
}

// Delete task
async function deleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
        await tasksStore.deleteTask(taskId)
        await loadTasks()
    } catch (error) {
        console.error('Failed to delete task:', error)
    }
}
</script>

<template>
    <ProjectHeader :title="projectTitle || 'Project Detailer'" subtitle="Project Tasks" />

    <div class="tasks-page">
        <!-- Add Task Button -->
        <div class="add-section">
            <button class="add-btn" @click="goToAddTask">
                + Add Task
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading">
            Loading tasks...
        </div>

        <!-- Empty State -->
        <div v-else-if="tasks && tasks.length === 0" class="empty-state">
            <div class="empty-icon">✅</div>
            <h3>No tasks yet</h3>
            <p>Add your first task to get started</p>
        </div>

        <!-- Tasks List -->
        <div v-else class="tasks-list">
            <Card
                v-for="task in tasks"
                :key="task._id.toString()"
                :inactive="task.status === 'completed'"
            >
                <div class="task-content">
                    <button 
                        class="status-checkbox"
                        :class="{ checked: task.status === 'completed' }"
                        @click="toggleStatus(task)"
                    >
                        <span v-if="task.status === 'completed'">✓</span>
                    </button>
                    
                    <div class="task-info">
                        <span class="task-title">{{ task.title }}</span>
                        <span v-if="task.description" class="task-desc">{{ task.description }}</span>
                    </div>
                    
                    <div class="task-actions">
                        <button class="action-btn edit" @click="goToEditTask(task._id.toString())" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn delete" @click="deleteTask(task._id.toString())" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            </Card>
        </div>

        <!-- Task Stats -->
        <div v-if="tasks && tasks.length > 0" class="task-stats">
            {{ tasks.filter(t => t.status === 'completed').length }} of {{ tasks.length }} completed
        </div>
    </div>
</template>

<style scoped>
.tasks-page {
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Add Section */
.add-section {
    margin-bottom: 0.5rem;
}

.add-btn {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
}

.add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

/* Loading / Empty State */
.loading {
    text-align: center;
    color: #808090;
    padding: 3rem;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 16px;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    color: #e0e0e0;
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
}

.empty-state p {
    color: #707080;
    margin: 0;
}

/* Tasks List */
.tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.task-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

/* Status Checkbox */
.status-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    transition: border-color 0.2s, background 0.2s;
    flex-shrink: 0;
    margin-top: 2px;
}

.status-checkbox:hover {
    border-color: #e94560;
}

.status-checkbox.checked {
    background: #e94560;
    border-color: #e94560;
}

/* Task Info */
.task-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.task-title {
    color: #e0e0e0;
    font-size: 1rem;
    font-weight: 500;
}

.card--inactive .task-title {
    text-decoration: line-through;
    color: #808090;
}

.task-desc {
    color: #707080;
    font-size: 0.85rem;
    line-height: 1.4;
}

/* Task Actions */
.task-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.card:hover .task-actions {
    opacity: 1;
}

.action-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.action-btn.delete:hover {
    background: rgba(255, 71, 87, 0.2);
}

/* Stats */
.task-stats {
    text-align: center;
    color: #707080;
    font-size: 0.85rem;
    padding-top: 0.5rem;
}
</style>
