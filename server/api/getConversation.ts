import { connectToMongoDB } from '../utils/mongodb'
import { Conversation } from '../models/Conversation'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { conversationId } = query
    const user = event.context.user as User

    if (!conversationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required parameter: conversationId'
        })
    }

    try {
        await connectToMongoDB()

        const conversation = await Conversation.findOne(
            { conversationId, userId: user.id },
            'title messages conversationId projectId createdAt'
        )

        if (!conversation) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Conversation not found'
            })
        }

        return conversation
    } catch (error: any) {
        console.error('Error getting conversation:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to get conversation'
        })
    }
})

