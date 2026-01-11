import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { projectId } = query
    const user = event.context.user as User

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required parameter: projectId'
        })
    }

    try {
        await connectToMongoDB()

        const tasks = await Task.find({ projectId, userId: user.id })
            .sort({ createdAt: -1 })
            .lean()

        return tasks
    } catch (error: any) {
        console.error('Error getting tasks:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to get tasks'
        })
    }
})

