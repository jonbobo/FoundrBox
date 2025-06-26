import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LaunchKit - Start Your Business in Minutes',
  description: 'Get everything you need to launch your business: logo, website, contracts, and marketing - all in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}