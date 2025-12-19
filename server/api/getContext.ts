import { Context } from "../models/Context"

export default defineEventHandler(async (event) => {
  const contextId = getQuery(event).contextId
  if (!contextId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Context ID is required'
    })
  }
  const context = await Context.findById(contextId, '-__v -createdAt -updatedAt -embedding', { lean: true })
  return context
})