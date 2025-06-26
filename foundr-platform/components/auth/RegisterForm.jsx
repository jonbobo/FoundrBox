'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, getPasswordStrength } from '@/lib/validations'
import { useAuthContext } from '@/components/context/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(null)
    const { signUp, signInWithGoogle, error, clearError } = useAuthContext()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError: setFormError
    } = useForm({
        resolver: zodResolver(registerSchema)
    })

    const watchPassword = watch('password', '')

    // Update password strength when password changes
    useEffect(() => {
        if (watchPassword) {
            setPasswordStrength(getPasswordStrength(watchPassword))
        } else {
            setPasswordStrength(null)
        }
    }, [watchPassword])

    const onSubmit = async (data) => {
        setIsLoading(true)
        clearError()

        const result = await signUp({
            fullName: data.fullName,
            email: data.email,
            password: data.password
        })

        if (result.success) {
            // Show success message - user needs to verify email
            router.push('/auth/verify-email')
        } else {
            // Show specific field errors or general error
            if (result.error.includes('already registered')) {
                setFormError('email', { message: 'This email is already registered' })
            } else {
                setFormError('root', { message: result.error })
            }
        }

        setIsLoading(false)
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        clearError()

        const result = await signInWithGoogle()

        if (!result.success) {
            setFormError('root', { message: result.error })
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <Input
                label="Full name"
                type="text"
                autoComplete="name"
                required
                {...register('fullName')}
                error={errors.fullName?.message}
                disabled={isLoading}
            />

            {/* Email */}
            <Input
                label="Email address"
                type="email"
                autoComplete="email"
                required
                {...register('email')}
                error={errors.email?.message}
                disabled={isLoading}
            />

            {/* Password */}
            <div>
                <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    required
                    {...register('password')}
                    error={errors.password?.message}
                    disabled={isLoading}
                />

                {/* Password Strength Indicator */}
                {passwordStrength && watchPassword && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                            <span className={`font-medium ${passwordStrength.color === 'red' ? 'text-red-600' :
                                passwordStrength.color === 'orange' ? 'text-orange-600' :
                                    passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                                        'text-green-600'
                                }`}>
                                {passwordStrength.label}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' :
                                    passwordStrength.color === 'orange' ? 'bg-orange-500' :
                                        passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                            'bg-green-500'
                                    }`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {!passwordStrength.checks.length && 'At least 8 characters'}
                            {!passwordStrength.checks.lowercase && ' • One lowercase letter'}
                            {!passwordStrength.checks.uppercase && ' • One uppercase letter'}
                            {!passwordStrength.checks.number && ' • One number'}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                required
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                disabled={isLoading}
            />

            {/* Terms Agreement */}
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="agreeToTerms"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('agreeToTerms')}
                        disabled={isLoading}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="text-gray-600 dark:text-gray-400">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                        </Link>
                    </label>
                    {errors.agreeToTerms && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.agreeToTerms.message}
                        </p>
                    )}
                </div>
            </div>

            {/* General Error */}
            {(error || errors.root) && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <div className="text-sm text-red-700 dark:text-red-400">
                        {error || errors.root?.message}
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                    </div>
                ) : (
                    'Create account'
                )}
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
            </div>

            {/* Google Sign In */}
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                size="lg"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </Button>

            {/* Sign In Link */}
            <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href="/auth/login"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                        Sign in
                    </Link>
                </span>
            </div>
        </form>
    )
}