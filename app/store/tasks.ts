import type { ITaskItem } from "~~/server/models/Task"
import { handleRequest } from "./utils/handleRequest"

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
            const tasks = await handleRequest(() => $fetch<ITaskItem[]>(`/api/getTasks?projectId=${projectId}`))
            if (tasks) {
                this.tasks = tasks
            }
        },
        async getTask(taskId: string) {
            const task = await handleRequest(() => $fetch<ITaskItem>(`/api/getTask?taskId=${taskId}`))
            if (task) {
                this.task = task
            }
        },
        async addTask(task: { projectId: string, title: string, description: string }) {
            return await handleRequest(() => $fetch('/api/addTask', {
                method: 'POST',
                body: task
            }))
        },
        async editTask(task: { taskId: string, title?: string, description?: string, status?: string }) {
            return await handleRequest(() => $fetch('/api/editTask', {
                method: 'POST',
                body: task
            }))
        },
        async deleteTask(taskId: string) {
            return await handleRequest(() => $fetch('/api/deleteTask', {
                method: 'DELETE',
                body: { taskId }
            }))
        }
    }
})