import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client (for components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Client component helper (for client components)
export const createSupabaseClient = () => {
    return createClientComponentClient()
}

// Admin client (for server-side operations)
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null

// Database table names (centralized)
export const TABLES = {
    USERS: 'users',
    BUSINESSES: 'businesses',
    WEBSITES: 'websites',
    CONTRACTS: 'contracts',
    BRANDING: 'branding'
}

// Auth event handlers
export const handleAuthStateChange = (event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email)
    }
    if (event === 'SIGNED_OUT') {
        console.log('User signed out')
    }
}

// Helper function to get current user
export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
    const user = await getCurrentUser()
    return !!user
}