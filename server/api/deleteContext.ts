import { connectToMongoDB } from '../utils/mongodb'
import { Context } from '../models/Context'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { contextId } = body

    if (!contextId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Context ID is required'
        })
    }

    try {
        await connectToMongoDB()
        await Context.findByIdAndDelete(contextId)
    } catch (error: any) {
        console.error('Error deleting context:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to delete context'
        })
    }
})