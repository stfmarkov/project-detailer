import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'

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

        const task = await Task.create({
            projectId,
            title,
            description: description || ''
        })

        return {
            success: true,
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

