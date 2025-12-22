import { createTask } from "./createTask";

export async function executeAIAction(action: string, data: any, projectId: string) {
    
    const actions = {
        create_task: createTask
    }

    if(action in actions) {
        return await actions[action as keyof typeof actions](data.title, data.description, projectId)
    }

    return {
        success: false,
        message: 'Action not found'
    }
}