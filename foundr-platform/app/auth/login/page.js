import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
    title: 'Sign In | LaunchKit',
    description: 'Sign in to your LaunchKit account to manage your business.',
}

export default function LoginPage() {
    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle="Welcome back! Please sign in to continue."
        >
            <LoginForm />
        </AuthLayout>
    )
}