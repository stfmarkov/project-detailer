import { Project } from '../models/Project'
import { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, category } = body
  const user = event.context.user as User

  if (!title || !category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: title and category are required'
    })
  }

  const project = await Project.create({ userId: user.id, title, category })
  return project
})