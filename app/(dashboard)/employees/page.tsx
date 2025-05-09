// app/(dashboard)/employees/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ShopService } from "@/lib/services/shop-service"
import { EmployeeService } from "@/lib/services/employee-service"
import type { Employee } from "@/types/employee"
import type { Shop } from "@/types/shop"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [employeesByShop, setEmployeesByShop] = useState<Record<number, Employee[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch shops based on user role
        let fetchedShops: Shop[] = []
        if (user?.role === "admin") {
          fetchedShops = await ShopService.getShops()
        } else if (user?.role === "owner") {
          fetchedShops = await ShopService.getShopsByOwner()
        }

        setShops(fetchedShops)

        // Fetch employees for each shop
        const employeesData: Record<number, Employee[]> = {}

        for (const shop of fetchedShops) {
          const employees = await EmployeeService.getEmployeesByShop(shop.id)
          employeesData[shop.id] = employees
        }

        setEmployeesByShop(employeesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])
}