import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { taskId } = query

    if (!taskId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required parameter: taskId'
        })
    }

    try {
        await connectToMongoDB()

        const task = await Task.findById(taskId).lean()

        if (!task) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Task not found'
            })
        }

        return task
    } catch (error: any) {
        console.error('Error getting task:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to get task'
        })
    }
})

