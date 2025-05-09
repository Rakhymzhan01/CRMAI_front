// lib/api.ts
import { ApiError } from "./error-utils"
import { toast } from "@/hooks/use-toast"

// API URL from environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Helper to get the auth token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Generic fetch function with error handling
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new ApiError("Session expired. Please login again.", 401)
    }

    // For non-204 responses, parse the JSON if possible
    if (response.status !== 204) {
      // Check if there's content to parse
      const text = await response.text()
      const data = text ? JSON.parse(text) : {}

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new ApiError(
          data.message || `Server error: ${response.status}`,
          response.status,
          data.error_code
        )
      }

      return data
    }

    return null
  } catch (error: any) {
    // Improve error handling for network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error: Could not connect to the API server.")
      throw new ApiError(
        "Could not connect to the server. Please check your connection or try again later.",
        0
      )
    }

    // Re-throw any ApiError instances
    if (error instanceof ApiError) {
      throw error
    }

    // Re-throw any other errors
    console.error("API Error:", error)
    throw new ApiError(error.message || "An unexpected error occurred", 0)
  }
}

// API methods
export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),

  post: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
}

// Response handler for mutations with toast notifications
export const handleApiResponse = async <T>(
  promise: Promise<T>,
  { successMessage = "Operation successful", errorMessage = "Operation failed" } = {},
): Promise<T> => {
  try {
    const result = await promise
    toast({
      title: "Success",
      description: successMessage,
    })
    return result
  } catch (error: any) {
    const message = error instanceof ApiError ? error.message : errorMessage
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })
    throw error
  }
}