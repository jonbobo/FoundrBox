'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
    signUp as authSignUp,
    signIn as authSignIn,
    signInWithGoogle as authSignInWithGoogle,
    signOut as authSignOut,
    resetPassword as authResetPassword,
    updatePassword as authUpdatePassword,
} from '@/lib/auth'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Error getting session:', error)
                } else if (session?.user) {
                    setUser(session.user)
                    await fetchUserProfile(session.user.id)
                }
            } catch (error) {
                console.error('Error in getInitialSession:', error)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email)

                setUser(session?.user ?? null)

                if (session?.user) {
                    await fetchUserProfile(session.user.id)
                } else {
                    setProfile(null)
                }

                setLoading(false)

                // Handle redirects
                if (event === 'SIGNED_IN') {
                    // Check if there's a redirect URL in localStorage or URL params
                    const urlParams = new URLSearchParams(window.location.search)
                    const redirectTo = urlParams.get('redirectTo') || localStorage.getItem('redirectAfterAuth')

                    if (redirectTo) {
                        localStorage.removeItem('redirectAfterAuth')
                        router.push(redirectTo)
                    } else {
                        router.push('/dashboard')
                    }
                } else if (event === 'SIGNED_OUT') {
                    router.push('/')
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [router])

    // Fetch user profile from our custom users table
    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error)
            } else {
                setProfile(data)
            }
        } catch (error) {
            console.error('Error in fetchUserProfile:', error)
        }
    }

    // Sign up with email and password
    const signUp = async ({ fullName, email, password, avatarUrl }) => {
        try {
            setError(null)
            setLoading(true)

            const result = await authSignUp(email, password, { fullName, avatarUrl })

            if (result.error) {
                setError(result.error)
                return { success: false, error: result.error }
            }

            return { success: true, user: result.user }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    // Sign in with email and password
    const signIn = async (email, password) => {
        try {
            setError(null)
            setLoading(true)

            const result = await authSignIn(email, password)

            if (result.error) {
                setError(result.error)
                return { success: false, error: result.error }
            }

            return { success: true, user: result.user }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setError(null)
            setLoading(true)

            const result = await authSignInWithGoogle()

            if (result.error) {
                setError(result.error)
                return { success: false, error: result.error }
            }

            // Google OAuth will redirect, so we don't need to handle success here
            return { success: true, data: result.data }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    // Update user profile
    const updateProfile = async (updates) => {
        if (!user) return { error: 'No user logged in' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single()

            if (error) throw error

            setProfile(data)
            return { data, error: null }
        } catch (error) {
            console.error('Error updating profile:', error)
            return { data: null, error: error.message }
        }
    }

    // Sign out
    const signOut = async () => {
        try {
            setError(null)
            const result = await authSignOut()

            if (result.error) {
                setError(result.error)
                return { success: false, error: result.error }
            }

            // Clear local state
            setUser(null)
            setProfile(null)

            return { success: true }
        } catch (error) {
            console.error('Error signing out:', error)
            setError(error.message)
            return { success: false, error: error.message }
        }
    }

    // Reset password
    const resetPassword = async (email) => {
        try {
            setError(null)
            const result = await authResetPassword(email)

            if (result.error) {
                setError(result.error)
                return { success: false, error: result.error }
            }

            return { success: true, data: result.data }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    // Update password
    const updatePassword = async (newPassword) => {
        try {
            setError(null)
            const result = await authUpdatePassword(newPassword)

            if (result.error) {
                setError(result.error)
                return { success: false, error: result.error }
            }

            return { success: true, user: result.user }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    // Clear error
    const clearError = () => setError(null)

    const value = {
        user,
        profile,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        clearError,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}

// Export an alias for useAuth to maintain compatibility
export const useAuth = useAuthContext