import { connectToMongoDB } from '../utils/mongodb'
import { Task } from '../models/Task'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { taskId, title, description, status } = body
    const user = event.context.user as User

    if (!taskId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required field: taskId'
        })
    }

    try {
        await connectToMongoDB()

        const updateData: Record<string, any> = {}
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (status !== undefined) updateData.status = status

        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: user.id },
            updateData,
            { new: true }
        ).lean()

        if (!task) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Task not found'
            })
        }

        return {
            success: true,
            task
        }
    } catch (error: any) {
        console.error('Error editing task:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to edit task'
        })
    }
})

