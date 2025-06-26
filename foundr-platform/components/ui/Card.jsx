export default function Card({
    children,
    className = '',
    hover = false,
    padding = true,
    ...props
}) {
    const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'
    const hoverStyles = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : ''
    const paddingStyles = padding ? 'p-6' : ''

    const classes = `${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    )
}

// Additional Card components for flexibility
export function CardHeader({ children, className = '' }) {
    return (
        <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
            {children}
        </h3>
    )
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`text-gray-600 dark:text-gray-300 ${className}`}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`}>
            {children}
        </div>
    )
}