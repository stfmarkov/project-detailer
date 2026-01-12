import { createTask } from "./createTask";
import createContext from "./createContext";
import getTasks from "./getTasks";

type ActionHandler = (data: any, projectId: string, userId: string) => Promise<{ success: boolean; message: string; data?: any }>

const actions: Record<string, ActionHandler> = {
    create_task: (data, projectId, userId) => createTask(data.title, data.description, projectId, userId),
    create_context: (data, projectId, userId) => createContext(data.title, data.content, projectId, userId),
    get_tasks: async (_, projectId, userId) => {
        const data = await getTasks(projectId, userId)
        return {
            success: true,
            message: 'Tasks fetched successfully',
            data: data
        }
    }
}

export async function executeAIAction(action: string, data: any, projectId: string, userId: string) {
    const handler = actions[action]
    
    if (handler) {
        return await handler(data, projectId, userId)
    }

    return {
        success: false,
        message: 'Action not found'
    }
}