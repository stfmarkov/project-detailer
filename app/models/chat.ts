export interface Message {
    role: 'user' | 'assistant'
    content: string
    sources?: Array<{ title: string; score: number }>
  }