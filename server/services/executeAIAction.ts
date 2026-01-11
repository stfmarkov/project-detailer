import { createTask } from "./createTask";
import { createContext } from "./createContext";

type ActionHandler = (data: any, projectId: string, userId: string) => Promise<{ success: boolean; message: string }>

const actions: Record<string, ActionHandler> = {
    create_task: (data, projectId, userId) => createTask(data.title, data.description, projectId, userId),
    create_context: (data, projectId, userId) => createContext(data.title, data.content, projectId, userId)
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