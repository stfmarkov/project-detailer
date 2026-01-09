import type { ITaskItem } from "~~/server/models/Task"

interface TasksStoreState {
    tasks: ITaskItem[]
    task: ITaskItem | null
}

export const useTasksStore = defineStore('tasks', {
    state: (): TasksStoreState => ({
        tasks: [],
        task: null
    }),
    actions: {
        async getTasks(projectId: string) {
            this.tasks = await $fetch<ITaskItem[]>(`/api/getTasks?projectId=${projectId}`)
        },
        async getTask(taskId: string) {
            this.task = await $fetch<ITaskItem>(`/api/getTask?taskId=${taskId}`)
        },
        async addTask(task: { projectId: string, title: string, description: string }) {
            await $fetch('/api/addTask', {
                method: 'POST',
                body: task
            })
        },
        async editTask(task: { taskId: string, title?: string, description?: string, status?: string }) {
            await $fetch('/api/editTask', {
                method: 'POST',
                body: task
            })
        },
        async deleteTask(taskId: string) {
            await $fetch('/api/deleteTask', {
                method: 'DELETE',
                body: { taskId }
            })
        }
    }
})