import { setCookie, deleteCookie } from 'h3'
import type { H3Event } from 'h3'

interface Session {
    access_token: string
    refresh_token: string
    expires_in: number
}

export const setAuthCookies = (event: H3Event, session: Session) => {
    const baseOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/'
    }

    setCookie(event, 'accessToken', session.access_token, {
        ...baseOptions,
        maxAge: session.expires_in
    })

    setCookie(event, 'refreshToken', session.refresh_token, {
        ...baseOptions,
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })
}

export const clearAuthCookies = (event: H3Event) => {
    deleteCookie(event, 'accessToken', { path: '/' })
    deleteCookie(event, 'refreshToken', { path: '/' })
}

