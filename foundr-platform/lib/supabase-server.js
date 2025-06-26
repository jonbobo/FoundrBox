import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Server component helper (for server components only)
export const createSupabaseServerClient = () => {
    return createServerComponentClient({ cookies })
}