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
   * Get shop by ID
   * @param {number} shopId - Shop ID
   * @returns {Promise<Shop>} - Promise with shop
   */
  getShopById: async (shopId: number): Promise<Shop> => {
    try {
      const response = await api.get(`/owner/shops/${shopId}`);
      
      return {
        id: response.id,
        name: response.name,
        description: response.description || '',
        ownerId: response.owner_id
      };
    } catch (error) {
      console.error(`Error fetching shop with ID ${shopId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new shop
   * @param {ShopFormData & { ownerId?: number }} data - Shop data
   * @returns {Promise<Shop>} - Promise with created shop
   */
  createShop: async (data: ShopFormData & { ownerId?: number }): Promise<Shop> => {
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
   * Update a shop
   * @param {number} shopId - Shop ID
   * @param {Partial<ShopFormData>} data - Shop data to update
   * @returns {Promise<Shop>} - Promise with updated shop
   */
  updateShop: async (shopId: number, data: Partial<ShopFormData>): Promise<Shop> => {
    const requestData: Partial<ShopRequestData> = {};
    
    if (data.name !== undefined) requestData.name = data.name;
    if (data.description !== undefined) requestData.description = data.description;
    
    return handleApiResponse(
      api.put(`/owner/shops/${shopId}`, requestData),
      {
        successMessage: "Shop updated successfully", 
        errorMessage: "Failed to update shop"
      }
    );
  },

  /**
   * Delete a shop
   * @param {number} shopId - Shop ID
   * @returns {Promise<void>} - Promise with result
   */
  deleteShop: async (shopId: number): Promise<void> => {
    return handleApiResponse(
      api.delete(`/admin/shops/${shopId}`),
      {
        successMessage: "Shop deleted successfully",
        errorMessage: "Failed to delete shop"
      }
    );
  }
};

export default ShopService;