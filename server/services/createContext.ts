import { connectToMongoDB } from '../utils/mongodb'
import { generateEmbedding } from '../utils/embeddings'
import { Context } from '../models/Context'

export async function createContext(title: string, content: string, projectId: string, userId: string) {
    await connectToMongoDB()

    // Generate embedding for the content
    const embedding = await generateEmbedding(content)

    const context = await Context.create({
        userId,
        projectId,
        title,
        content,
        embedding
    })

    return {
        success: true,
        message: `Created context: ${context.title}`,
        data: {
            id: context._id,
            title: context.title
        }
    }
}

