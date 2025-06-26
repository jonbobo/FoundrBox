import { supabase, supabaseAdmin } from './supabase'

// Sign up with email and password
export async function signUp(email, password, userData = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: userData.fullName || '',
                    avatar_url: userData.avatarUrl || '',
                }
            }
        })

        if (error) throw error

        // Create user profile in our custom users table
        if (data.user) {
            await createUserProfile(data.user.id, {
                email: data.user.email,
                full_name: userData.fullName || '',
                avatar_url: userData.avatarUrl || '',
            })
        }

        return { user: data.user, error: null }
    } catch (error) {
        console.error('Sign up error:', error)
        return { user: null, error: error.message }
    }
}

// Sign in with email and password
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error
        return { user: data.user, error: null }
    } catch (error) {
        console.error('Sign in error:', error)
        return { user: null, error: error.message }
    }
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Google sign in error:', error)
        return { data: null, error: error.message }
    }
}

// Sign out
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Clear any local storage or cache if needed
        localStorage.removeItem('business-data')

        return { error: null }
    } catch (error) {
        console.error('Sign out error:', error)
        return { error: error.message }
    }
}

// Reset password
export async function resetPassword(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Reset password error:', error)
        return { data: null, error: error.message }
    }
}

// Update password
export async function updatePassword(newPassword) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) throw error
        return { user: data.user, error: null }
    } catch (error) {
        console.error('Update password error:', error)
        return { user: null, error: error.message }
    }
}

// Create user profile in custom table
async function createUserProfile(userId, profileData) {
    try {
        if (!supabaseAdmin) {
            console.warn('Supabase admin client not available')
            return
        }

        const { data, error } = await supabaseAdmin
            .from('users')
            .insert({
                id: userId,
                ...profileData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Create user profile error:', error)
        // Don't throw here - user is already created in auth.users
    }
}

// Get user profile
export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return { profile: data, error: null }
    } catch (error) {
        console.error('Get user profile error:', error)
        return { profile: null, error: error.message }
    }
}

// Update user profile
export async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return { profile: data, error: null }
    } catch (error) {
        console.error('Update user profile error:', error)
        return { profile: null, error: error.message }
    }
}

// Check if user exists
export async function checkUserExists(email) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

        return { exists: !!data, error: error?.code !== 'PGRST116' ? error : null }
    } catch (error) {
        console.error('Check user exists error:', error)
        return { exists: false, error: error.message }
    }
}

// Session management
export function getSession() {
    return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
}