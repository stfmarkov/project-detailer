import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'
import { createTask } from '../services/createTask'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { projectId, title, description } = body

    if (!projectId || !title) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields: projectId and title are required'
        })
    }

    try {
        await connectToMongoDB()

        const { success, message: task } = await createTask(title, description, projectId)

        return {
            success,
            task
        }
    } catch (error: any) {
        console.error('Error adding task:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to add task'
        })
    }
})

