// components/notification.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface NotificationProps {
  message: string
  type?: "info" | "success" | "warning" | "error"
  duration?: number
  onClose?: () => void
  actions?: {
    label: string
    onClick: () => void
  }[]
}

export function Notification({
  message,
  type = "info",
  duration = 5000,
  onClose,
  actions = [],
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Icons.check className="h-5 w-5 text-green-500" />
      case "warning":
        return <Icons.alertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <Icons.alertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Icons.info className="h-5 w-5 text-blue-500" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "success":
        return "border-l-4 border-l-green-500 bg-green-50"
      case "warning":
        return "border-l-4 border-l-amber-500 bg-amber-50"
      case "error":
        return "border-l-4 border-l-red-500 bg-red-50"
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50"
    }
  }

  return (
    <Card className={`shadow-md ${getColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">{getIcon()}</div>
          <div className="flex-1">{message}</div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
            <Icons.close className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardContent>
      {actions.length > 0 && (
        <CardFooter className="flex gap-2 p-3 pt-0">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}