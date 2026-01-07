export interface ChunkOptions {
  maxChunkSize?: number    // Max characters per chunk (default: 2000)
  overlapSize?: number     // Characters to overlap between chunks (default: 200)
}

export interface Chunk {
  content: string
  index: number
}

/**
 * Checks if a block of text is a list item (bullet or numbered)
 */
function isListItem(text: string): boolean {
  const trimmed = text.trim()
  // Bullet lists: -, *, +
  // Numbered lists: 1., 2., etc.
  return /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)
}

/**
 * Merges consecutive list items into single blocks.
 * Keeps lists together as semantic units.
 */
function mergeListBlocks(paragraphs: string[]): string[] {
  const merged: string[] = []
  let currentList: string[] = []

  for (const paragraph of paragraphs) {
    if (isListItem(paragraph)) {
      // Add to current list
      currentList.push(paragraph)
    } else {
      // Not a list item - flush any accumulated list first
      if (currentList.length > 0) {
        merged.push(currentList.join('\n\n'))
        currentList = []
      }
      merged.push(paragraph)
    }
  }

  // Don't forget to flush any remaining list at the end
  if (currentList.length > 0) {
    merged.push(currentList.join('\n\n'))
  }

  return merged
}

/**
 * Splits text into overlapping chunks based on semantic blocks.
 * Keeps paragraphs and lists together, with overlap from previous block.
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

  // Merge consecutive list items into single blocks
  const blocks = mergeListBlocks(paragraphs)

  // If no blocks or single block, return as single chunk
  if (blocks.length === 0) {
    return []
  }
  
  if (blocks.length === 1) {
    return [{ content: blocks[0], index: 0 }]
  }

  const chunks: Chunk[] = []

  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i]
    let chunkContent = currentBlock

    // Add overlap from previous block (except for first chunk)
    if (i > 0) {
      const prevBlock = blocks[i - 1]
      
      // If previous block is smaller than overlapSize, take half of it
      // Otherwise take the last overlapSize characters
      const overlapLength = prevBlock.length < overlapSize 
        ? Math.floor(prevBlock.length / 2)
        : overlapSize
      
      if (overlapLength > 0) {
        const overlap = prevBlock.slice(-overlapLength)
        chunkContent = overlap + '\n\n' + currentBlock
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

