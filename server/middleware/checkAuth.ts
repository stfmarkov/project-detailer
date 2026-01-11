import supabase from "../utils/supabase"
import { setAuthCookies } from "../utils/auth"

// Public routes that don't require authentication
const publicRoutes = [
    '/api/signIn',
    '/api/signUp',
    '/api/signOut'
]

export default defineEventHandler(async (event) => {
    const path = getRequestURL(event).pathname

    // Skip auth check for non-API routes (pages are handled by frontend)
    if (!path.startsWith('/api/')) {
        return
    }

    // Skip auth check for public API routes
    if (publicRoutes.some(route => path === route)) {
        return
    }

    const accessToken = getCookie(event, 'accessToken')
    
    if (!accessToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized - Please sign in'
        })
    }

    try {
        const { data, error } = await supabase.auth.getUser(accessToken)
        
        if (error) {
            // Token might be expired, try to refresh
            const refreshToken = getCookie(event, 'refreshToken')
            
            if (refreshToken) {
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
                    refresh_token: refreshToken
                })

                if (!refreshError && refreshData.session) {
                    setAuthCookies(event, refreshData.session)

                    // Attach user to event context
                    event.context.user = refreshData.user
                    return
                }
            }

            throw createError({
                statusCode: 401,
                statusMessage: 'Session expired - Please sign in again'
            })
        }

        // Attach user to event context for use in API handlers
        event.context.user = data.user
    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication failed'
        })
    }
})