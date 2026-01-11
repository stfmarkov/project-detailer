import { connectToMongoDB } from '../utils/mongodb'
import { Context } from '../models/Context'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = event.context.user as User

  const { fileId } = body

  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required field: fileId'
    })
  }

  try {
    await connectToMongoDB()

    // Delete all context entries with this fileId
    const result = await Context.deleteMany({ fileId, userId: user.id })

    return {
      success: true,
      message: `File deleted successfully (${result.deletedCount} chunk${result.deletedCount !== 1 ? 's' : ''} removed)`,
      data: {
        fileId,
        deletedCount: result.deletedCount
      }
    }
  } catch (error: any) {
    console.error('Error deleting file context:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete file context'
    })
  }
})

