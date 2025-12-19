import { Context } from "../models/Context"
import { connectToMongoDB } from "../utils/mongodb"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { contextId, title, content } = body
  if (!contextId || !title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: contextId, title, and content are required'
    })
  }
  try {
    await connectToMongoDB()
    await Context.findByIdAndUpdate(contextId, { title, content })
    return {
      success: true,
      message: 'Context updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating context:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update context'
    })
  }
})