import supabase from "../utils/supabase"
import { setAuthCookies } from "../utils/auth"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body
    
    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and password are required'
        })
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) {
            throw createError({
                statusCode: 401,
                statusMessage: error.message
            })
        }

        if (!data.session) {
            throw createError({
                statusCode: 401,
                statusMessage: 'No session returned'
            })
        }

        setAuthCookies(event, data.session)

        return { 
            success: true, 
            user: {
                id: data.user?.id,
                email: data.user?.email
            }
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})