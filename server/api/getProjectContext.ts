import { connectToMongoDB } from '../utils/mongodb'
import { Context } from '../models/Context'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await getQuery(event)
    const { projectId } = body
    const user = event.context.user as User

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
        })
    }

    try {
        await connectToMongoDB()

        const context = await Context.find(
            {
                projectId,
                userId: user.id,
                fileId: { $exists: false }
            },
            '-__v -embedding',
            { lean: true }
        )

        // Get unique files by aggregating on fileId
        const files = await Context.aggregate([
            { 
                $match: { 
                    projectId, 
                    userId: user.id,
                    fileId: { $exists: true, $ne: null } 
                } 
            },
            {
                $group: {
                    _id: '$fileId',
                    fileName: { $first: '$fileName' },
                    chunksCount: { $sum: 1 },
                    createdAt: { $min: '$createdAt' }
                }
            },
            {
                $project: {
                    _id: 0,
                    fileId: '$_id',
                    fileName: 1,
                    chunksCount: 1,
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ])

        return {
            success: true,
            message: 'Context fetched successfully',
            data: {
                context,
                files
            }
        }
    } catch (error: any) {
        console.error('Error fetching context:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to fetch context'
        })
    }
})