// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Baldy Trivia Challenge',
  description: 'Test your knowledge with a new trivia question every day!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link href="/" className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-blue-600">Daily Trivia</h1>
                  </Link>
                </div>
                <div className="flex items-center">
                  {user?.isAdmin ? (
                    <Link 
                      href="/admin" 
                      className="text-gray-600 hover:text-gray-900 mr-4"
                    >
                      Admin Dashboard
                    </Link>
                  ) : null}
                  
                  {user ? (
                    <Link 
                      href="/api/auth/signout" 
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Sign Out
                    </Link>
                  ) : (
                    <Link 
                      href="/auth/signin" 
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Admin Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          
          <footer className="bg-white">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Baldy Trivia Challenge. Created by Mita. All rights reserved. 
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}