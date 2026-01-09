<script setup lang="ts">
import { useTasksStore } from '@/store/tasks'
import { useProjectsStore } from '@/store/projects'
import type { ITaskItem } from '~~/server/models/Task'

definePageMeta({
    layout: 'project'
})

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
const projectTitle = computed(() => projectsStore.currentProject?.title)

// Tasks state
const tasks = computed(() => tasksStore.tasks)
const isLoading = ref(true)

// Add task form
const showAddForm = ref(false)
const newTask = reactive({
    title: '',
    description: ''
})
const isAdding = ref(false)

// Edit state
const editingTaskId = ref<string | null>(null)
const editForm = reactive({
    title: '',
    description: ''
})
const isEditing = ref(false)

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

// Add task
async function addTask() {
    if (!newTask.title.trim()) return
    
    isAdding.value = true
    try {
        await tasksStore.addTask({
            projectId: projectId.value,
            title: newTask.title,
            description: newTask.description
        })
        newTask.title = ''
        newTask.description = ''
        showAddForm.value = false
        await loadTasks()
    } catch (error) {
        console.error('Failed to add task:', error)
    } finally {
        isAdding.value = false
    }
}

// Start editing
function startEdit(task: ITaskItem) {
    editingTaskId.value = task._id.toString()
    editForm.title = task.title
    editForm.description = task.description
}

// Cancel editing
function cancelEdit() {
    editingTaskId.value = null
    editForm.title = ''
    editForm.description = ''
}

// Save edit
async function saveEdit(taskId: string) {
    if (!editForm.title.trim()) return
    
    isEditing.value = true
    try {
        await $fetch('/api/editTask', {
            method: 'POST',
            body: {
                taskId,
                title: editForm.title,
                description: editForm.description
            }
        })
        cancelEdit()
        await loadTasks()
    } catch (error) {
        console.error('Failed to edit task:', error)
    } finally {
        isEditing.value = false
    }
}

// Toggle status
async function toggleStatus(task: ITaskItem) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
        await $fetch('/api/editTask', {
            method: 'POST',
            body: {
                taskId: task._id.toString(),
                status: newStatus
            }
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
        await $fetch('/api/deleteTask', {
            method: 'POST',
            body: { taskId }
        })
        await loadTasks()
    } catch (error) {
        console.error('Failed to delete task:', error)
    }
}
</script>

<template>
    <ProjectHeader :title="projectTitle || 'Project Detailer'" subtitle="Project Tasks" />

    <div class="tasks-page">
        <!-- Add Task Button / Form -->
        <div class="add-section">
            <button v-if="!showAddForm" class="add-btn" @click="showAddForm = true">
                + Add Task
            </button>
            
            <div v-else class="add-form">
                <input
                    v-model="newTask.title"
                    type="text"
                    placeholder="Task title..."
                    class="input"
                    :disabled="isAdding"
                    @keyup.enter="addTask"
                    autofocus
                />
                <textarea
                    v-model="newTask.description"
                    placeholder="Description (optional)..."
                    class="textarea"
                    :disabled="isAdding"
                    rows="2"
                />
                <div class="form-actions">
                    <button class="cancel-btn" @click="showAddForm = false" :disabled="isAdding">
                        Cancel
                    </button>
                    <button class="save-btn" @click="addTask" :disabled="isAdding || !newTask.title.trim()">
                        {{ isAdding ? 'Adding...' : 'Add Task' }}
                    </button>
                </div>
            </div>
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
                <!-- View Mode -->
                <div v-if="editingTaskId !== task._id.toString()" class="task-content">
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
                        <button class="action-btn edit" @click="startEdit(task)" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn delete" @click="deleteTask(task._id.toString())" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>

                <!-- Edit Mode -->
                <div v-else class="task-edit">
                    <input
                        v-model="editForm.title"
                        type="text"
                        class="input"
                        :disabled="isEditing"
                        @keyup.enter="saveEdit(task._id.toString())"
                        autofocus
                    />
                    <textarea
                        v-model="editForm.description"
                        class="textarea"
                        :disabled="isEditing"
                        rows="2"
                    />
                    <div class="form-actions">
                        <button class="cancel-btn" @click="cancelEdit" :disabled="isEditing">
                            Cancel
                        </button>
                        <button 
                            class="save-btn" 
                            @click="saveEdit(task._id.toString())" 
                            :disabled="isEditing || !editForm.title.trim()"
                        >
                            {{ isEditing ? 'Saving...' : 'Save' }}
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

.add-form {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* Form Elements */
.input,
.textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 0.95rem;
    font-family: inherit;
}

.input::placeholder,
.textarea::placeholder {
    color: #606070;
}

.input:focus,
.textarea:focus {
    outline: none;
    border-color: #e94560;
}

.textarea {
    resize: vertical;
    min-height: 60px;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

.cancel-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #a0a0b0;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
}

.cancel-btn:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.3);
    color: #e0e0e0;
}

.save-btn {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

.card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    transition: border-color 0.2s;
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

/* Edit Mode */
.task-edit {
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* Stats */
.task-stats {
    text-align: center;
    color: #707080;
    font-size: 0.85rem;
    padding-top: 0.5rem;
}
</style>
