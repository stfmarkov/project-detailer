import { createTask } from "./createTask";
import { createContext } from "./createContext";

type ActionHandler = (data: any, projectId: string) => Promise<{ success: boolean; message: string }>

const actions: Record<string, ActionHandler> = {
    create_task: (data, projectId) => createTask(data.title, data.description, projectId),
    create_context: (data, projectId) => createContext(data.title, data.content, projectId)
}

export async function executeAIAction(action: string, data: any, projectId: string) {
    const handler = actions[action]
    
    if (handler) {
        return await handler(data, projectId)
    }

    return {
        success: false,
        message: 'Action not found'
    }
}