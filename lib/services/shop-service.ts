// lib/services/shop-service.ts
import { api, handleApiResponse } from "../api";
import { Shop, ShopFormData } from "@/types/shop";

// Interface to match backend expectations
interface ShopRequestData {
  name: string;
  description: string;
  owner_id?: number;
}

export const ShopService = {
  /**
   * Get all shops (admin only)
   * @returns {Promise<Shop[]>} - Promise with shops
   */
  getShops: async (): Promise<Shop[]> => {
    try {
      const response = await api.get("/admin/shops");
      
      // Transform response to match frontend Shop type
      return Array.isArray(response) ? response.map(shop => ({
        id: shop.id,
        name: shop.name,
        description: shop.description || '',
        ownerId: shop.owner_id
      })) : [];
    } catch (error) {
      console.error("Error fetching shops:", error);
      throw error;
    }
  },

  /**
   * Get shops by owner (owner role)
   * @returns {Promise<Shop[]>} - Promise with shops
   */
  getShopsByOwner: async (): Promise<Shop[]> => {
    try {
      const response = await api.get("/owner/shops");
      
      // Transform response to match frontend Shop type
      return Array.isArray(response) ? response.map(shop => ({
        id: shop.id,
        name: shop.name,
        description: shop.description || '',
        ownerId: shop.owner_id
      })) : [];
    } catch (error) {
      console.error("Error fetching shops by owner:", error);
      throw error;
    }
  },

  /**
   * Create a new shop (admin only)
   * @param {ShopFormData & { ownerId: number }} data - Shop data
   * @returns {Promise<void>} - Promise with result
   */
  createShop: async (data: ShopFormData & { ownerId: number }): Promise<void> => {
    const requestData: ShopRequestData = {
      name: data.name,
      description: data.description,
      owner_id: data.ownerId
    };
    
    return handleApiResponse(
      api.post("/admin/shops", requestData),
      { 
        successMessage: "Shop created successfully",
        errorMessage: "Failed to create shop"
      }
    );
  },

  /**
   * Get shop employees
   * @param {number} shopId - Shop ID
   * @returns {Promise<any[]>} - Promise with employees data
   */
  getShopEmployees: async (shopId: number): Promise<any[]> => {
    try {
      const response = await api.get(`/owner/shops/${shopId}/employees`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error(`Error fetching employees for shop ${shopId}:`, error);
      throw error;
    }
  },

  /**
   * Add employee to shop
   * @param {number} shopId - Shop ID
   * @param {any} employeeData - Employee data
   * @returns {Promise<void>} - Promise with result
   */
  addEmployee: async (shopId: number, employeeData: any): Promise<void> => {
    return handleApiResponse(
      api.post(`/owner/shops/${shopId}/employees`, employeeData),
      {
        successMessage: "Employee added successfully",
        errorMessage: "Failed to add employee"
      }
    );
  },

  /**
   * Remove employee from shop
   * @param {number} shopId - Shop ID
   * @param {number} employeeId - Employee ID
   * @returns {Promise<void>} - Promise with result
   */
  removeEmployee: async (shopId: number, employeeId: number): Promise<void> => {
    return handleApiResponse(
      api.delete(`/owner/shops/${shopId}/employees/${employeeId}`),
      {
        successMessage: "Employee removed successfully",
        errorMessage: "Failed to remove employee"
      }
    );
  }
};

export default ShopService;