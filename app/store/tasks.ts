import type { ITaskItem } from "~~/server/models/Task"

interface TasksStoreState {
    tasks: ITaskItem[]
}

export const useTasksStore = defineStore('tasks', {
    state: (): TasksStoreState => ({
        tasks: []
    }),
    actions: {
        async getTasks(projectId: string) {
            this.tasks = await $fetch<ITaskItem[]>(`/api/getTasks?projectId=${projectId}`)
        },
        async addTask(task: { projectId: string, title: string, description: string }) {
            await $fetch('/api/addTask', {
                method: 'POST',
                body: task
            })
        },
        async editTask(task: { taskId: string, title: string, description: string }) {
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