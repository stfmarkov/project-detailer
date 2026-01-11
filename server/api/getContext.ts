import { User } from "@supabase/supabase-js"
import { Context } from "../models/Context"

export default defineEventHandler(async (event) => {
  const contextId = getQuery(event).contextId
  const user = event.context.user as User
  if (!contextId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Context ID is required'
    })
  }
  const context = await Context.findOne(
    { _id: contextId, userId: user.id }, 
    '-__v -createdAt -updatedAt -embedding', 
    { lean: true }
  )
  return context
})