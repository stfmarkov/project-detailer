import { connectToMongoDB } from '../utils/mongodb'
import { generateEmbedding } from '../utils/embeddings'
import { chat } from '../utils/claude'
import { Context } from '../models/Context'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { projectId, question } = body

  if (!projectId || !question) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: projectId and question are required'
    })
  }

  try {
    await connectToMongoDB()

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question)

    // Perform vector search to find relevant contexts
    const results = await Context.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: questionEmbedding,
          numCandidates: 50,
          limit: 5,
          filter: { projectId: projectId }
        }
      },
      {
        $project: {
          title: 1,
          content: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ])

    // Get answer from Claude using retrieved contexts
    const answer = await chat(question, results)

    return {
      success: true,
      answer,
      sources: results.map(r => ({
        title: r.title,
        score: r.score
      }))
    }
  } catch (error: any) {
    console.error('Chat error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process question'
    })
  }
})

