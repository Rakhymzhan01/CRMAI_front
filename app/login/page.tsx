// app/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AuthService } from "@/lib/services/auth-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    // Clear any previous error messages
    setErrorMessage(null)
    
    try {
      setIsLoading(true)
      console.log("Attempting login with:", { email: data.email, password: "***" })
      
      const response = await AuthService.login(data.email, data.password)
      
      if (response && response.token) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        // Handle case where login succeeded but no token was returned
        setErrorMessage("Login successful but no authentication token was received")
        console.error("Login response missing token:", response)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Set a user-friendly error message
      setErrorMessage(error.message || "Invalid email or password. Please try again.")
      
      // Also show a toast for visibility
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Shop CRM</CardTitle>
          <CardDescription className="text-center">Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50">
            <AlertDescription>
              <div className="text-sm text-blue-700">
                <p className="font-medium">Available test account:</p>
                <ul className="mt-1 list-disc pl-5">
                  <li>SuperAdmin: admin@crm.kz</li>
                  <li>Password: superAdmin123</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {errorMessage && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertDescription>
                <div className="text-sm text-red-700">
                  {errorMessage}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500 text-center">Shop CRM Management System</p>
          <div className="text-sm text-center text-gray-500">
            Don't have an account?
          </div>
          <Link href="/register" passHref>
            <Button 
              variant="outline" 
              className="w-full"
            >
              Create a New Account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}