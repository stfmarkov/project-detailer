interface VoyageEmbeddingResponse {
  data: Array<{
    embedding: number[]
  }>
  usage: {
    total_tokens: number
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY

  if (!apiKey) {
    throw new Error('VOYAGE_API_KEY environment variable is not set')
  }

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-2',
      input: text
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Voyage AI API error: ${error}`)
  }

  const data: VoyageEmbeddingResponse = await response.json()
  return data.data[0].embedding
}

