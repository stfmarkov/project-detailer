import { connectToMongoDB } from '../utils/mongodb'
import { Conversation } from '../models/Conversation'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { projectId } = query

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required parameter: projectId'
        })
    }

    try {
        await connectToMongoDB()

        const conversations = await Conversation.find({ projectId }, 'title createdAt _id conversationId').sort({ createdAt: -1 })

        return conversations
    } catch (error: any) {
        console.error('Error getting conversations:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to get conversations'
        })
    }
})

