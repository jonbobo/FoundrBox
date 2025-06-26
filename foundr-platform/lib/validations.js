import { z } from 'zod'

// Common validation patterns
const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )

const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

// Authentication schemas
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms and conditions'
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

export const forgotPasswordSchema = z.object({
    email: emailSchema
})

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// Business information schemas (for future weeks)
export const businessInfoSchema = z.object({
    businessName: z
        .string()
        .min(2, 'Business name must be at least 2 characters')
        .max(100, 'Business name must be less than 100 characters'),
    businessType: z
        .string()
        .min(1, 'Please select a business type'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters'),
    location: z
        .string()
        .min(2, 'Location is required'),
    phone: z
        .string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
        .optional()
        .or(z.literal('')),
    website: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal(''))
})

export const contactInfoSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
    phone: z
        .string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
    address: z.object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
        country: z.string().min(1, 'Country is required')
    })
})

// Profile update schema
export const profileUpdateSchema = z.object({
    fullName: nameSchema.optional(),
    email: emailSchema.optional(),
    phone: z
        .string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
        .optional()
        .or(z.literal('')),
    bio: z
        .string()
        .max(200, 'Bio must be less than 200 characters')
        .optional()
})

// Service/pricing schemas (for future weeks)
export const serviceSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be positive'),
    duration: z.number().min(15, 'Duration must be at least 15 minutes'),
    category: z.string().min(1, 'Category is required')
})

// Contract schemas (for future weeks)
export const contractSchema = z.object({
    title: z.string().min(1, 'Contract title is required'),
    clientName: nameSchema,
    clientEmail: emailSchema,
    serviceDescription: z.string().min(10, 'Service description is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    dueDate: z.string().min(1, 'Due date is required'),
    terms: z.string().min(50, 'Terms must be at least 50 characters')
})

// Validation helper functions
export function validateForm(schema, data) {
    try {
        const validatedData = schema.parse(data)
        return { success: true, data: validatedData, errors: null }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.reduce((acc, err) => {
                acc[err.path[0]] = err.message
                return acc
            }, {})
            return { success: false, data: null, errors }
        }
        return { success: false, data: null, errors: { general: 'Validation failed' } }
    }
}

// Custom validation functions
export function validatePassword(password) {
    const result = passwordSchema.safeParse(password)
    return {
        isValid: result.success,
        errors: result.success ? [] : result.error.errors.map(err => err.message)
    }
}

export function validateEmail(email) {
    const result = emailSchema.safeParse(email)
    return {
        isValid: result.success,
        error: result.success ? null : result.error.errors[0]?.message
    }
}

// Password strength checker
export function getPasswordStrength(password) {
    let score = 0
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    score = Object.values(checks).filter(Boolean).length

    const strength = {
        0: { label: 'Very Weak', color: 'red' },
        1: { label: 'Weak', color: 'red' },
        2: { label: 'Fair', color: 'orange' },
        3: { label: 'Good', color: 'yellow' },
        4: { label: 'Strong', color: 'green' },
        5: { label: 'Very Strong', color: 'green' }
    }

    return {
        score,
        checks,
        ...strength[score]
    }
}