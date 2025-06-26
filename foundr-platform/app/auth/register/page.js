import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
    title: 'Create Account | LaunchKit',
    description: 'Create your LaunchKit account and start building your business today.',
}

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join thousands of entrepreneurs who've launched their business with LaunchKit."
        >
            <RegisterForm />
        </AuthLayout>
    )
}