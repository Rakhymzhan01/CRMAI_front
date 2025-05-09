// lib/error-utils.ts
import { useToast } from "@/hooks/use-toast"

export class ApiError extends Error {
  public statusCode: number
  public errorCode?: string

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message
  } else if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred. Please try again."
}

export const useApiErrorHandler = () => {
  const { toast } = useToast()

  const handleError = (error: unknown, defaultMessage = "An error occurred") => {
    const errorMessage = handleApiError(error)
    toast({
      title: "Error",
      description: errorMessage || defaultMessage,
      variant: "destructive",
    })
    return errorMessage
  }

  return { handleError }
}