import { connectToMongoDB } from '../utils/mongodb'
import { Conversation } from '../models/Conversation'
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

        const conversations = await Conversation.find({ projectId, userId: user.id }, 'title createdAt _id conversationId').sort({ createdAt: -1 })

        return conversations
    } catch (error: any) {
        console.error('Error getting conversations:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to get conversations'
        })
    }
})

