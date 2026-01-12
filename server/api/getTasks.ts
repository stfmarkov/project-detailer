import { User } from '@supabase/supabase-js'
import getTasks from '../services/getTasks'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { projectId } = query
    const user = event.context.user as User

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required parameter: projectId'
        })
    }

    try {
        return await getTasks(projectId as string, user.id)
    } catch (error: any) {
        console.error('Error getting tasks:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to get tasks'
        })
    }
})

