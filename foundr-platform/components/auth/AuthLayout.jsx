import Link from 'next/link'

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <Link href="/" className="flex justify-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        LaunchKit
                    </div>
                </Link>

                {/* Title */}
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    )
}