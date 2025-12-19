import { connectToMongoDB } from '../utils/mongodb'
import { Context } from '../models/Context'

export default defineEventHandler(async (event) => {
    const body = await getQuery(event)
    const { projectId } = body

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
        })
    }

    try {
        await connectToMongoDB()

        const context = await Context.find({ projectId }, '-__v -createdAt -updatedAt -embedding', { lean: true })

        return {
            success: true,
            message: 'Context fetched successfully',
            data: context
        }
    } catch (error: any) {
        console.error('Error fetching context:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to fetch context'
        })
    }
})