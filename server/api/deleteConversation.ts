import { connectToMongoDB } from '../utils/mongodb'
import { Conversation } from '../models/Conversation'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { conversationId } = body
    const user = event.context.user as User

    if (!conversationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required field: conversationId'
        })
    }

    try {
        await connectToMongoDB()

        const result = await Conversation.deleteOne({ conversationId, userId: user.id })

        if (result.deletedCount === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Conversation not found'
            })
        }

        return {
            success: true,
            message: 'Conversation deleted successfully'
        }
    } catch (error: any) {
        console.error('Error deleting conversation:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to delete conversation'
        })
    }
})

