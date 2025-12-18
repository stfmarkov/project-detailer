import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
})

interface ChatContext {
  title: string
  content: string
}

export async function chat(question: string, contexts: ChatContext[]): Promise<string> {
  // Build context section from retrieved documents
  const contextText = contexts.length > 0
    ? contexts.map((ctx, i) => `[${i + 1}] ${ctx.title}\n${ctx.content}`).join('\n\n---\n\n')
    : 'No relevant information found in the project knowledge base.'

  const systemPrompt = `You are a helpful assistant for a project knowledge base. 
Your role is to answer questions based ONLY on the provided context from the project.

IMPORTANT RULES:
1. Only use information from the provided context to answer questions
2. If the context doesn't contain relevant information, clearly say "I don't have information about that in the current project data"
3. When answering, reference which piece of context you're using when helpful
4. Be concise but thorough
5. If asked about something not in the context, don't make up information

PROJECT CONTEXT:
${contextText}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      { role: 'user', content: question }
    ]
  })

  // Extract text from response
  const textBlock = response.content.find(block => block.type === 'text')
  return textBlock ? textBlock.text : 'Sorry, I could not generate a response.'
}

