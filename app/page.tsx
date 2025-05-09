// app/page.tsx
"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function HomePage() {
  const { user } = useAuth()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Retail Business with Ease
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our Shop CRM system helps you manage shops, employees, and inventory all in one place. 
                  Boost your productivity and grow your business.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {user ? (
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      <Icons.dashboard className="mr-2 h-5 w-5" />
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/register">
                        <Icons.add className="mr-2 h-5 w-5" />
                        Create Account
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/login">
                        <Icons.arrowRight className="mr-2 h-5 w-5" />
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-blue-50 p-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.shop className="h-48 w-48 text-blue-200" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm">
                  <div className="space-y-2 rounded-lg bg-white/80 p-4">
                    <h3 className="font-bold">Comprehensive Solution</h3>
                    <p className="text-sm text-gray-600">
                      Manage shops, employees, inventory, and more in a single unified platform. 
                      Perfect for retail businesses of any size.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Key Features
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Everything you need to manage your retail business effectively
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-1">
              <Icons.shop className="h-10 w-10 text-blue-600" />
              <h3 className="text-xl font-bold">Shop Management</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create and manage multiple retail locations with ease. Track performance and set goals.
              </p>
            </div>
            <div className="grid gap-1">
              <Icons.employee className="h-10 w-10 text-purple-600" />
              <h3 className="text-xl font-bold">Employee Management</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your staff across all locations. Track roles, assignments, and performance.
              </p>
            </div>
            <div className="grid gap-1">
              <Icons.item className="h-10 w-10 text-emerald-600" />
              <h3 className="text-xl font-bold">Inventory Tracking</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Keep track of your items, prices, and stock levels. Get alerts when inventories are low.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            {!user && (
              <Button asChild size="lg">
                <Link href="/register">Get Started Today</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}