export interface ChunkOptions {
  maxChunkSize?: number    // Max characters per chunk (default: 2000)
  overlapSize?: number     // Characters to overlap between chunks (default: 200)
}

export interface Chunk {
  content: string
  index: number
}

/**
 * Splits text into overlapping chunks based on paragraphs.
 * Each paragraph becomes a chunk, with overlap from the previous paragraph.
 */
export function chunkText(text: string, options: ChunkOptions = {}): Chunk[] {
  const { maxChunkSize = 2000, overlapSize = 200 } = options

  // Normalize line endings (Windows \r\n → Unix \n)
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Split into paragraphs (by double newline)
  const paragraphs = normalizedText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  // If no paragraphs or single paragraph that fits, return as single chunk
  if (paragraphs.length === 0) {
    return []
  }
  
  if (paragraphs.length === 1) {
    return [{ content: paragraphs[0], index: 0 }]
  }

  const chunks: Chunk[] = []

  for (let i = 0; i < paragraphs.length; i++) {
    const currentParagraph = paragraphs[i]
    let chunkContent = currentParagraph

    // Add overlap from previous paragraph (except for first chunk)
    if (i > 0) {
      const prevParagraph = paragraphs[i - 1]
      
      // If previous paragraph is smaller than overlapSize, take half of it
      // Otherwise take the last overlapSize characters
      const overlapLength = prevParagraph.length < overlapSize 
        ? Math.floor(prevParagraph.length / 2)
        : overlapSize
      
      if (overlapLength > 0) {
        const overlap = prevParagraph.slice(-overlapLength)
        chunkContent = overlap + '\n\n' + currentParagraph
      }
    }

    chunks.push({
      content: chunkContent,
      index: i
    })
  }

  return chunks
}

/**
 * Generates a simple UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

