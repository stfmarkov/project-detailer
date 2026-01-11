import { useGlobalStore } from '../global'

interface ErrorResponse {
    statusMessage: string
    statusCode: number
}

interface HandleRequestOptions {
    skipRedirect?: boolean  // Don't redirect on 401 (useful for auth pages)
    showToast?: boolean     // Show error toast (default: true)
}

export const handleRequest = async <T>(
    request: () => Promise<T>,
    options: HandleRequestOptions = {}
): Promise<T | null> => {
    const { skipRedirect = false, showToast = true } = options

    try {
        return await request()
    } catch (error) {
        const errorMessage = (error as ErrorResponse)?.statusMessage || 'Unknown error'
        const errorCode = (error as ErrorResponse)?.statusCode

        if (showToast) {
            const globalStore = useGlobalStore()
            globalStore.setToast(errorMessage, 'error')
        }

        if (errorCode === 401 && !skipRedirect) {
            navigateTo('/login')
        }

        console.error('Request failed:', error)
        return null
    }
}