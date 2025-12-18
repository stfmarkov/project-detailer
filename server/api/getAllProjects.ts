import { connectToMongoDB } from '../utils/mongodb'
import { Project } from '../models/Project'

export default defineEventHandler(async (event) => {
  try {
    await connectToMongoDB()
    const projects = await Project.find()
    return projects
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get projects'
    })
  }
})