import Anthropic from '@anthropic-ai/sdk'
import { connectToMongoDB } from '../utils/mongodb'
import { Conversation, type IMessage } from '../models/Conversation'
import { executeAIAction } from '../services/executeAIAction'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
})

const tools: Anthropic.Tool[] = [
  {
    name: 'create_context',
    description: 'Create a new context entry in the knowledge base. Use this to save important insights, decisions, facts, or ideas from the conversation.',
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'A clear, descriptive title for this piece of knowledge'
        },
        content: {
          type: 'string',
          description: 'The actual content/information to save. Should be self-contained and understandable without the original conversation.'
        }
      },
      required: ['title', 'content']
    }
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { conversationId, deleteAfter = false } = body

  if (!conversationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required field: conversationId'
    })
  }

  try {
    await connectToMongoDB()

    // Fetch the conversation
    const conversation = await Conversation.findOne({ conversationId })

    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Conversation not found'
      })
    }

    // Format conversation for AI
    const conversationText = conversation.messages
      .map((msg: IMessage) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n')

    const systemPrompt = `You are a helpful assistant that extracts key information from conversations into a knowledge base.

Your task is to analyze the conversation and use the create_context tool to save important insights.

Rules:
1. Extract only genuinely useful information worth remembering
2. Each context entry should be self-contained and understandable without the original conversation
3. Use clear, descriptive titles
4. Content should be concise but complete
5. Focus on: decisions made, facts learned, ideas discussed, requirements identified, solutions found
6. Call create_context for EACH distinct piece of knowledge (you can call it multiple times)
7. If the conversation has no extractable value, simply respond that there's nothing to extract

After extracting all insights, provide a brief summary of what was saved.`

    const messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: `Extract key insights from this conversation and save them to the knowledge base:\n\n${conversationText}`
      }
    ]

    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      tools,
      messages
    })

    const createdContexts: Array<{ title: string }> = []

    // Process tool calls
    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      )

      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const toolUse of toolUseBlocks) {
        if (toolUse.name === 'create_context') {
          const input = toolUse.input as { title: string; content: string }
          const result = await executeAIAction(
            toolUse.name, 
            toolUse.input, 
            conversation.projectId
          )

          if (result.success) {
            createdContexts.push({ title: input.title })
          }

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result.success
              ? `Successfully created context: "${input.title}"`
              : `Failed to create context: ${result.message}`
          })
        }
      }

      messages.push({ role: 'assistant', content: response.content })
      messages.push({ role: 'user', content: toolResults })

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        tools,
        messages
      })
    }

    // Optionally delete the conversation
    if (deleteAfter && createdContexts.length > 0) {
      await Conversation.deleteOne({ conversationId })
    }

    return {
      success: true,
      message: `Extracted ${createdContexts.length} context${createdContexts.length !== 1 ? 's' : ''} from conversation`,
      data: {
        contexts: createdContexts,
        deleted: deleteAfter && createdContexts.length > 0
      }
    }
  } catch (error: any) {
    console.error('Error extracting conversation context:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to extract conversation context'
    })
  }
})

