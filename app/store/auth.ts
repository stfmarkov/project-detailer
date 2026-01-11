import { handleRequest } from "./utils/handleRequest"

interface User {
    id: string
    email: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false
    }),
    actions: {
        async signIn(email: string, password: string) {
            const response = await handleRequest(
                () => $fetch<{ success: boolean; user: User }>('/api/signIn', {
                    method: 'POST',
                    body: { email, password }
                }),
                { skipRedirect: true }
            )
            
            if (response) {
                this.user = response.user
                this.isAuthenticated = true
            }
            return response
        },

        async signUp(email: string, password: string) {
            const response = await handleRequest(
                () => $fetch<{ 
                    success: boolean
                    message: string
                    user?: User
                    requiresConfirmation?: boolean 
                }>('/api/signUp', {
                    method: 'POST',
                    body: { email, password }
                }),
                { skipRedirect: true }
            )
            
            if (response?.user) {
                this.user = response.user
                this.isAuthenticated = true
            }
            
            return response
        },

        async signOut() {
            const result = await handleRequest(() => $fetch('/api/signOut', { method: 'POST' }))
            if (result) {
                this.user = null
                this.isAuthenticated = false
            }
        },

        async checkAuth() {
            const response = await handleRequest(
                () => $fetch<{ user: User }>('/api/getMe'),
                { skipRedirect: true, showToast: false }
            )
            
            if (response) {
                this.user = response.user
                this.isAuthenticated = true
                return true
            }
            
            this.user = null
            this.isAuthenticated = false
            return false
        }
    }
})

