// lib/services/employee-service.ts
import { api, handleApiResponse } from "../api";
import { Employee } from "@/types/employee";

// Interface to match backend expectations
interface EmployeeRequestData {
  name: string;
  email: string;
  role: string;
}

export const EmployeeService = {
  /**
   * Get employees for a shop
   * @param {number} shopId - Shop ID
   * @returns {Promise<Employee[]>} - Promise with employees
   */
  getEmployeesByShop: async (shopId: number): Promise<Employee[]> => {
    try {
      const response = await api.get(`/owner/shops/${shopId}/employees`);
      
      // Transform response to match frontend Employee type
      return Array.isArray(response) ? response.map(employee => ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        shopId: shopId,
        role: employee.role
      })) : [];
    } catch (error) {
      console.error(`Error fetching employees for shop ${shopId}:`, error);
      throw error;
    }
  },

  /**
   * Add employee to shop
   * @param {number} shopId - Shop ID
   * @param {Omit<Employee, "id">} data - Employee data
   * @returns {Promise<Employee>} - Promise with created employee
   */
  createEmployee: async (shopId: number, data: Omit<Employee, "id">): Promise<Employee> => {
    const requestData: EmployeeRequestData = {
      name: data.name,
      email: data.email,
      role: data.role,
    };
    
    return handleApiResponse(
      api.post(`/owner/shops/${shopId}/employees`, requestData),
      {
        successMessage: "Employee added successfully",
        errorMessage: "Failed to add employee"
      }
    );
  },

  /**
   * Delete an employee
   * @param {number} shopId - Shop ID
   * @param {number} employeeId - Employee ID
   * @returns {Promise<void>} - Promise with result
   */
  deleteEmployee: async (shopId: number, employeeId: number): Promise<void> => {
    return handleApiResponse(
      api.delete(`/owner/shops/${shopId}/employees/${employeeId}`),
      {
        successMessage: "Employee removed successfully",
        errorMessage: "Failed to remove employee"
      }
    );
  }
};

export default EmployeeService;