import type { User } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    // User is attached by the auth middleware
    const user = event.context.user as User

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated'
        })
    }

    return {
        user: {
            id: user.id,
            email: user.email
        }
    }
})

