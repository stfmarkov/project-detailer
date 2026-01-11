import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { taskId } = body
    const user = event.context.user as User

    if (!taskId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required field: taskId'
        })
    }

    try {
        await connectToMongoDB()

        const task = await Task.findOneAndDelete({ _id: taskId, userId: user.id })

        if (!task) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Task not found'
            })
        }

        return {
            success: true,
            message: 'Task deleted successfully'
        }
    } catch (error: any) {
        console.error('Error deleting task:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to delete task'
        })
    }
})

