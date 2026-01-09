import { connectToMongoDB } from '../utils/mongodb'
import { generateEmbedding } from '../utils/embeddings'
import { chat, generateTitle } from '../utils/claude'
import { Context } from '../models/Context'
import { Task } from '../models/Task'
import { Conversation } from '../models/Conversation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { projectId, question, conversationId } = body

  if (!projectId || !question) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: projectId and question are required'
    })
  }

  try {
    await connectToMongoDB()

    let conversation = await Conversation.findOne({ projectId, conversationId })

    if (!conversation) {
      // Generate a title for the conversation
      const title = await generateTitle(question)
      
      conversation = await Conversation.create({
        projectId,
        conversationId,
        title,
        messages: []
      })
    }

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

    // Fetch active tasks (pending and in_progress)
    const tasks = await Task.find({
      projectId,
      status: { $in: ['pending', 'in_progress'] }
    }).sort({ createdAt: -1 }).lean()

    // Get answer from Claude using retrieved contexts and tasks
    const answer = await chat(question, results, tasks, projectId, conversationId)

    conversation.messages.push({ role: 'user', content: question })
    conversation.messages.push({ role: 'assistant', content: answer })
    await conversation.save()

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

