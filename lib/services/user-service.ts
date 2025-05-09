// lib/services/user-service.ts
import { api, handleApiResponse } from "../api";
import { User, UserFormData } from "@/types/user";

// Interface to match backend expectations
interface UserRequestData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: string;
}

export const UserService = {
  /**
   * Get all users (admin only)
   * @returns {Promise<User[]>} - Promise with users
   */
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get("/admin/users");
      
      // Transform backend data to match frontend User type
      return Array.isArray(response) ? response.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      })) : [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Create a new user (admin only)
   * @param {UserFormData} data - User data
   * @returns {Promise<void>} - Promise with result
   */
  createUser: async (data: UserFormData): Promise<void> => {
    // Transform frontend data to match backend expectations
    const requestData: UserRequestData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role
    };
    
    return handleApiResponse(
      api.post("/admin/users", requestData),
      {
        successMessage: "User created successfully",
        errorMessage: "Failed to create user"
      }
    );
  },

  /**
   * Update a user (admin only)
   * @param {number} id - User ID
   * @param {Partial<UserFormData>} data - User data
   * @returns {Promise<void>} - Promise with result
   */
  updateUser: async (id: number, data: Partial<UserFormData>): Promise<void> => {
    // Transform frontend data to match backend expectations
    const requestData: Partial<UserRequestData> = {};
    
    if (data.firstName !== undefined) requestData.first_name = data.firstName;
    if (data.lastName !== undefined) requestData.last_name = data.lastName;
    if (data.email !== undefined) requestData.email = data.email;
    if (data.password !== undefined) requestData.password = data.password;
    if (data.role !== undefined) requestData.role = data.role;
    
    return handleApiResponse(
      api.put(`/admin/users/${id}`, requestData),
      {
        successMessage: "User updated successfully",
        errorMessage: "Failed to update user"
      }
    );
  },

  /**
   * Delete a user (admin only)
   * @param {number} id - User ID
   * @returns {Promise<void>} - Promise with result
   */
  deleteUser: async (id: number): Promise<void> => {
    return handleApiResponse(
      api.delete(`/admin/users/${id}`),
      {
        successMessage: "User deleted successfully",
        errorMessage: "Failed to delete user"
      }
    );
  }
};

export default UserService;