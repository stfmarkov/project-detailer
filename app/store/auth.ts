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
            const response = await $fetch<{ success: boolean; user: User }>('/api/signIn', {
                method: 'POST',
                body: { email, password }
            })
            
            this.user = response.user
            this.isAuthenticated = true
            return response
        },

        async signUp(email: string, password: string) {
            const response = await $fetch<{ 
                success: boolean
                message: string
                user?: User
                requiresConfirmation?: boolean 
            }>('/api/signUp', {
                method: 'POST',
                body: { email, password }
            })
            
            if (response.user) {
                this.user = response.user
                this.isAuthenticated = true
            }
            
            return response
        },

        async signOut() {
            await $fetch('/api/signOut', { method: 'POST' })
            this.user = null
            this.isAuthenticated = false
        },

        async checkAuth() {
            try {
                // Try to fetch something that requires auth to check if we're logged in
                const response = await $fetch<{ user: User }>('/api/getMe')
                this.user = response.user
                this.isAuthenticated = true
                return true
            } catch {
                this.user = null
                this.isAuthenticated = false
                return false
            }
        }
    }
})

