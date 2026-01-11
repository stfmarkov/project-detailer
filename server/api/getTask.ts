import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { taskId } = query
    const user = event.context.user as User

    if (!taskId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required parameter: taskId'
        })
    }

    try {
        await connectToMongoDB()

        const task = await Task.findOne({ _id: taskId, userId: user.id }).lean()

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

