import { clearAuthCookies } from "../utils/auth"

export default defineEventHandler(async (event) => {
    clearAuthCookies(event)

    return { 
        success: true, 
        message: 'Signed out successfully' 
    }
})

