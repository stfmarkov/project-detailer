import supabase from '../utils/supabase'
import { setAuthCookies } from '../utils/auth'

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
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        
        if (error) {
            throw createError({
                statusCode: 400,
                statusMessage: error.message
            })
        }

        // If email confirmation is disabled, user gets a session immediately
        if (data.session) {
            setAuthCookies(event, data.session)

            return {
                success: true,
                message: 'Account created successfully',
                user: {
                    id: data.user?.id,
                    email: data.user?.email
                }
            }
        }

        // If email confirmation is enabled, no session yet
        return {
            success: true,
            message: 'Please check your email to confirm your account',
            requiresConfirmation: true
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})