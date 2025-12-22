import { Task } from "../models/Task"

export async function createTask(title: string, description: string, projectId: string) {
    await connectToMongoDB()

    const task = await Task.create({
        projectId,
        title,
        description: description || ''
    })

    return {
        success: true,
        message: task
    }
}