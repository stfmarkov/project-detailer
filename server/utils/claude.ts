import Anthropic from '@anthropic-ai/sdk'
import { executeAIAction } from '../services/executeAIAction'
import { Conversation, type IMessage } from '../models/Conversation'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
})

interface ChatContext {
  title: string
  content: string
}

interface ChatTask {
  title: string
  description: string
  status: string
}

const tools: Anthropic.Tool[] = [
  {
    name: 'create_task',
    description: 'Create a new task for the project. Use this when the user asks to create, add, or generate tasks.',
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the task'
        },
        description: {
          type: 'string',
          description: 'A brief description of what the task involves'
        }
      },
      required: ['title']
    }
  }
]

const generateTitle = async (question: string) => {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `
      You are a helpful assistant that generates titles for project conversations. 
      The title should be a single sentence that captures the main idea of the question provided by the user.
      The title should be no more than 10 words.
      The title should be in the same context as the question.
    `,
    messages: [{ role: 'user', content: question }]
  })
  return (response.content[0] as Anthropic.TextBlock).text
}

const chat = async (question: string, contexts: ChatContext[], tasks: ChatTask[] = [], projectId: string, conversationId: string, userId: string): Promise<string> => {
  // Build context section from retrieved documents
  const contextText = contexts.length > 0
    ? contexts.map((ctx, i) => `[${i + 1}] ${ctx.title}\n${ctx.content}`).join('\n\n---\n\n')
    : 'No relevant information found in the project knowledge base.'

  // Build tasks section
  const tasksText = tasks.length > 0
    ? tasks.map(t => `- [${t.status.toUpperCase()}] ${t.title}${t.description ? `: ${t.description}` : ''}`).join('\n')
    : 'No active tasks.'


  // Fetch conversation history
  const conversation = await Conversation.findOne({ conversationId })
  const conversationHistory = conversation?.messages || []

  const systemPrompt = `You are a helpful assistant for a project knowledge base. 
    Your role is to answer questions based ONLY on the provided context and tasks from the project.

    IMPORTANT RULES:
    1. Only use information from the provided context and tasks to answer questions
    2. If the context doesn't contain relevant information, clearly say "I don't have information about that in the current project data"
    3. When answering, reference which piece of context you're using when helpful
    4. Be concise but thorough
    5. If asked about something not in the context, don't make up information
    6. When asked about tasks, refer to the active tasks list
    7. You can help prioritize, summarize, or explain tasks based on the project context
    8. You can use the tools to create new tasks

    PROJECT CONTEXT:
    ${contextText}

    ACTIVE TASKS:
    ${tasksText}

    TOOL USAGE:
    When using a tool, you must use the tool name and parameters exactly as specified. Do not use any other text or formatting.
    When using a tool, you must return the result of the tool in the format specified by the tool.
    If you use a tool, you should say so in the response.
    `

  // Build messages array with conversation history
  const messages: Anthropic.MessageParam[] = [
    // Add previous messages from conversation history
    ...conversationHistory.map((msg: IMessage) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
    // Add current question
    { role: 'user', content: question }
  ]

  let response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    tools,
    messages
  })

  while (response.stop_reason === 'tool_use') {
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    )

    const toolResults: Anthropic.ToolResultBlockParam[] = []

    for (const toolUse of toolUseBlocks) {
      const { success, message } = await executeAIAction(toolUse.name, toolUse.input, projectId, userId)


      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: success
          ? `Successfully executed tool: ${toolUse.name}`
          : `Failed to execute ${toolUse.name}: ${message}`
      })

    }

    messages.push({ role: 'assistant', content: response.content })
    messages.push({ role: 'user', content: toolResults })

    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages
    })
  }


  const finalTextBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  )

  return finalTextBlock?.text ?? 'Sorry, I could not generate a response.'
}

export { chat, generateTitle }