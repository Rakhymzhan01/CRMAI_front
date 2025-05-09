// app/(public)/layout.tsx
"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.shop className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">Shop CRM</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <Icons.dashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:underline">
                  Sign In
                </Link>
                <Button asChild size="sm">
                  <Link href="/register">Create Account</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-4 px-6 text-center text-sm text-gray-500">
        <p>© 2025 Shop CRM. All rights reserved.</p>
      </footer>
    </div>
  )
}