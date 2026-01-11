import { connectToMongoDB } from '../utils/mongodb'
import { generateEmbedding } from '../utils/embeddings'
import { Context } from '../models/Context'
import { chunkText, generateUUID } from '../utils/chunking'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { projectId, fileName, content } = body

  if (!projectId || !fileName || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: projectId, fileName, and content are required'
    })
  }

  try {
    await connectToMongoDB()

    // Generate a unique file ID to group all chunks
    const fileId = generateUUID()

    // Chunk the content
    const chunks = chunkText(content, {
      maxChunkSize: 2000,
      overlapSize: 20
    })

    // Create context entries for each chunk
    const createdContexts = []

    for (const chunk of chunks) {
      // Generate embedding for this chunk
      const embedding = await generateEmbedding(chunk.content)

      // Create title based on file name and chunk index
      const title = chunks.length > 1 
        ? `${fileName} (part ${chunk.index + 1}/${chunks.length})`
        : fileName

      const user = event.context.user as User

      const context = await Context.create({
        projectId,
        userId: user.id,
        title,
        content: chunk.content,
        embedding,
        fileId,
        fileName,
        chunkIndex: chunk.index
      })

      createdContexts.push({
        id: context._id,
        title: context.title,
        chunkIndex: chunk.index
      })
    }

    return {
      success: true,
      message: `File added successfully (${chunks.length} chunk${chunks.length > 1 ? 's' : ''})`,
      data: {
        fileId,
        fileName,
        projectId,
        chunksCount: chunks.length,
        chunks: createdContexts
      }
    }
  } catch (error: any) {
    console.error('Error adding file context:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to add file context'
    })
  }
})

