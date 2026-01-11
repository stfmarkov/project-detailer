import { Project } from '../models/Project'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { projectId } = query
    const user = event.context.user as User

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
        })
    }

    try {
        await connectToMongoDB()
        const project = await Project.findOne({ _id: projectId, userId: user.id })
        return project ? project : null
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to connect to MongoDB'
        })
    }
})