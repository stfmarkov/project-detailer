import { connectToMongoDB } from '../utils/mongodb'
import { Project } from '../models/Project'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = event.context.user as User

  try {
    await connectToMongoDB()
    const projects = await Project.find({ userId: user.id })
    return projects
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get projects'
    })
  }
})