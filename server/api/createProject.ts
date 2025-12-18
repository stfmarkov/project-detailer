import { Project } from '../models/Project'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, category } = body

  if (!title || !category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: title and category are required'
    })
  }

  const project = await Project.create({ title, category })
  return project
})