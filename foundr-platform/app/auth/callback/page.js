
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Handle the OAuth callback
                const { data, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Auth callback error:', error)
                    router.push('/auth/login?error=callback_error')
                    return
                }

                if (data.session) {
                    // Successfully authenticated
                    console.log('Auth callback successful')
                    router.push('/dashboard')
                } else {
                    // No session found
                    router.push('/auth/login?error=no_session')
                }
            } catch (error) {
                console.error('Unexpected callback error:', error)
                router.push('/auth/login?error=unexpected_error')
            }
        }

        handleAuthCallback()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    Completing sign in...
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Please wait while we redirect you.
                </p>
            </div>
        </div>
    )
}