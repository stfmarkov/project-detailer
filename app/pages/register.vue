<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

definePageMeta({
    layout: 'default'
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
    email: '',
    password: '',
    confirmPassword: ''
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function handleSubmit() {
    error.value = null
    successMessage.value = null

    if (!form.email.trim() || !form.password.trim()) {
        error.value = 'Please fill in all fields'
        return
    }

    if (form.password !== form.confirmPassword) {
        error.value = 'Passwords do not match'
        return
    }

    if (form.password.length < 6) {
        error.value = 'Password must be at least 6 characters'
        return
    }

    isSubmitting.value = true

    try {
        const response = await authStore.signUp(form.email, form.password)
        
        if (response.requiresConfirmation) {
            successMessage.value = response.message
        } else {
            router.push('/')
        }
    } catch (err: any) {
        error.value = err.data?.statusMessage || 'Failed to create account'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-header">
                <h1 class="auth-title">Create an account</h1>
                <p class="auth-subtitle">Get started with Project Detailer</p>
            </div>

            <form @submit.prevent="handleSubmit" class="form">
                <div class="field">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="you@example.com"
                        :disabled="isSubmitting"
                        autofocus
                    />
                </div>

                <div class="field">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        v-model="form.password"
                        type="password"
                        placeholder="••••••••"
                        :disabled="isSubmitting"
                    />
                </div>

                <div class="field">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        :disabled="isSubmitting"
                    />
                </div>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <div v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </div>

                <button type="submit" class="submit-btn" :disabled="isSubmitting || !!successMessage">
                    <span v-if="isSubmitting">Creating account...</span>
                    <span v-else>Create Account</span>
                </button>
            </form>

            <p class="auth-footer">
                Already have an account?
                <NuxtLink to="/login" class="auth-link">Sign in</NuxtLink>
            </p>
        </div>
    </div>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.auth-container {
    width: 100%;
    max-width: 400px;
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
}

.auth-subtitle {
    color: #808090;
    margin: 0;
    font-size: 1rem;
}

.form {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 2rem;
}

.field {
    margin-bottom: 1.5rem;
}

.field label {
    display: block;
    color: #e0e0e0;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.field input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #ffffff;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.field input::placeholder {
    color: #606070;
}

.field input:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
}

.field input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    padding: 0.875rem 1rem;
    background: rgba(255, 71, 87, 0.15);
    border: 1px solid rgba(255, 71, 87, 0.3);
    border-radius: 8px;
    color: #ff4757;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
}

.success-message {
    padding: 0.875rem 1rem;
    background: rgba(46, 213, 115, 0.15);
    border: 1px solid rgba(46, 213, 115, 0.3);
    border-radius: 8px;
    color: #2ed573;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
}

.submit-btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

.submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.auth-footer {
    text-align: center;
    margin-top: 1.5rem;
    color: #808090;
    font-size: 0.95rem;
}

.auth-link {
    color: #e94560;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
}

.auth-link:hover {
    opacity: 0.8;
}
</style>

