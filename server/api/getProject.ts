import { Project } from '../models/Project'
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { projectId } = query

    console.log(query)

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
        })
    }

    try {
        await connectToMongoDB()
        const project = await Project.findById(projectId)
        return project ? project : null
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to connect to MongoDB'
        })
    }
})