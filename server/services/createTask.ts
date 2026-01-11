import { Task } from "../models/Task"

export async function createTask(title: string, description: string, projectId: string, userId: string) {
    await connectToMongoDB()

    const task = await Task.create({
        userId,
        projectId,
        title,
        description: description || ''
    })

    return {
        success: true,
        message: task
    }
}