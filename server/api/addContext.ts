import { connectToMongoDB } from '../utils/mongodb'
import { generateEmbedding } from '../utils/embeddings'
import { Context } from '../models/Context'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  // Validate required fields
  const { projectId, title, content } = body

  if (!projectId || !title || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: projectId, title, and content are required'
    })
  }

  try {
    // Connect to MongoDB
    await connectToMongoDB()

    // Generate embedding from the content
    const embedding = await generateEmbedding(content)

    const user = event.context.user as User

    // Save to database
    const context = await Context.create({
      userId: user.id,
      projectId,
      title,
      content,
      embedding
    })

    return {
      success: true,
      message: 'Context added successfully',
      data: {
        id: context._id,
        projectId: context.projectId,
        title: context.title,
        createdAt: context.createdAt
      }
    }
  } catch (error: any) {
    console.error('Error adding context:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to add context'
    })
  }
})
