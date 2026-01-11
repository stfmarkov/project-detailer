import type { IProjectListItem } from "~~/server/models/Project"
import { handleRequest } from "./utils/handleRequest"

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
            const projects = await handleRequest(() => $fetch<IProjectListItem[]>('/api/getAllProjects'))
            if (projects) {
                this.projects = projects
            }
        },
        async getProject(projectId: string) {
            const project = await handleRequest(() => $fetch<IProjectListItem>(`/api/getProject?projectId=${projectId}`))
            if (project) {
                this.currentProject = project
            }
        }
    }
})  