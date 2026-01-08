import { connectToMongoDB } from '../utils/mongodb'
import { Conversation } from '../models/Conversation'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { conversationId, title } = body

    if (!conversationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required field: conversationId'
        })
    }

    if (!title || !title.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Title cannot be empty'
        })
    }

    try {
        await connectToMongoDB()

        const conversation = await Conversation.findOneAndUpdate(
            { conversationId },
            { title: title.trim() },
            { new: true }
        )

        if (!conversation) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Conversation not found'
            })
        }

        return {
            success: true,
            message: 'Conversation updated successfully',
            data: {
                conversationId: conversation.conversationId,
                title: conversation.title
            }
        }
    } catch (error: any) {
        console.error('Error updating conversation:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to update conversation'
        })
    }
})

