import { forwardRef } from 'react'

const Input = forwardRef(function Input({
    label,
    error,
    helpText,
    className = '',
    type = 'text',
    required = false,
    ...props
}, ref) {
    const baseStyles = 'w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200'

    const normalStyles = 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
    const errorStyles = 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'

    const inputStyles = error ? errorStyles : normalStyles
    const classes = `${baseStyles} ${inputStyles} ${className}`

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <input
                ref={ref}
                type={type}
                className={classes}
                {...props}
            />

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {helpText}
                </p>
            )}
        </div>
    )
})

export default Input

// Textarea variant
export function Textarea({
    label,
    error,
    helpText,
    className = '',
    rows = 4,
    required = false,
    ...props
}) {
    const baseStyles = 'w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 resize-vertical'

    const normalStyles = 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
    const errorStyles = 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'

    const inputStyles = error ? errorStyles : normalStyles
    const classes = `${baseStyles} ${inputStyles} ${className}`

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                rows={rows}
                className={classes}
                {...props}
            />

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {helpText}
                </p>
            )}
        </div>
    )
}