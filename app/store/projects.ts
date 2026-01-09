import type { IProject, IProjectListItem } from "~~/server/models/Project"

interface ProjectsStoreState {
    projects: IProjectListItem[]
    currentProject: IProjectListItem | null
}

export const useProjectsStore = defineStore('projects', {

    state: (): ProjectsStoreState => ({
        projects: [],
        currentProject: null
    }),

    actions: {
        async fetchProjects() {
            this.projects = await $fetch<IProjectListItem[]>('/api/getAllProjects')
        },
        async getProject(projectId: string) {
            this.currentProject = await $fetch<IProjectListItem>(`/api/getProject?projectId=${projectId}`)
        }
    }
})  