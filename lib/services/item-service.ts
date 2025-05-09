// lib/services/item-service.ts
import { api, handleApiResponse } from "../api";
import { Item } from "@/types/item";

// Interface to match backend expectations
interface ItemRequestData {
  name: string;
  brand: string;
  category: string;
  size: string;
  purchase_price: number;
  sale_price: number;
  photo_url?: string;
}

export const ItemService = {
  /**
   * Get items for a shop
   * @param {number} shopId - Shop ID
   * @returns {Promise<Item[]>} - Promise with items
   */
  getItemsByShop: async (shopId: number): Promise<Item[]> => {
    try {
      const response = await api.get(`/owner/shops/${shopId}/items`);
      
      // Transform response to match frontend Item type
      return Array.isArray(response) ? response.map(item => ({
        id: item.id,
        shopId: shopId,
        name: item.name,
        brand: item.brand,
        category: item.category,
        size: item.size,
        purchasePrice: item.purchase_price,
        salePrice: item.sale_price,
        photoUrl: item.photo_url || 'https://placehold.co/300x300',
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) : [];
    } catch (error) {
      console.error(`Error fetching items for shop ${shopId}:`, error);
      throw error;
    }
  },

  /**
   * Add item to shop
   * @param {number} shopId - Shop ID
   * @param {Omit<Item, "id" | "createdAt" | "updatedAt">} data - Item data
   * @returns {Promise<Item>} - Promise with created item
   */
  createItem: async (shopId: number, data: Omit<Item, "id" | "createdAt" | "updatedAt">): Promise<Item> => {
    const requestData: ItemRequestData = {
      name: data.name,
      brand: data.brand,
      category: data.category,
      size: data.size,
      purchase_price: data.purchasePrice,
      sale_price: data.salePrice,
      photo_url: data.photoUrl
    };
    
    return handleApiResponse(
      api.post(`/owner/shops/${shopId}/items`, requestData),
      {
        successMessage: "Item added successfully",
        errorMessage: "Failed to add item"
      }
    );
  },

  /**
   * Update an item
   * @param {number} shopId - Shop ID
   * @param {number} itemId - Item ID
   * @param {Partial<Omit<Item, "id" | "shopId" | "createdAt" | "updatedAt">>} data - Item data to update
   * @returns {Promise<Item>} - Promise with updated item
   */
  updateItem: async (
    shopId: number, 
    itemId: number, 
    data: Partial<Omit<Item, "id" | "shopId" | "createdAt" | "updatedAt">>
  ): Promise<Item> => {
    const requestData: Partial<ItemRequestData> = {};
    
    if (data.name !== undefined) requestData.name = data.name;
    if (data.brand !== undefined) requestData.brand = data.brand;
    if (data.category !== undefined) requestData.category = data.category;
    if (data.size !== undefined) requestData.size = data.size;
    if (data.purchasePrice !== undefined) requestData.purchase_price = data.purchasePrice;
    if (data.salePrice !== undefined) requestData.sale_price = data.salePrice;
    if (data.photoUrl !== undefined) requestData.photo_url = data.photoUrl;
    
    return handleApiResponse(
      api.put(`/owner/shops/${shopId}/items/${itemId}`, requestData),
      {
        successMessage: "Item updated successfully",
        errorMessage: "Failed to update item"
      }
    );
  },

  /**
   * Delete an item
   * @param {number} shopId - Shop ID
   * @param {number} itemId - Item ID
   * @returns {Promise<void>} - Promise with result
   */
  deleteItem: async (shopId: number, itemId: number): Promise<void> => {
    return handleApiResponse(
      api.delete(`/owner/shops/${shopId}/items/${itemId}`),
      {
        successMessage: "Item deleted successfully",
        errorMessage: "Failed to delete item"
      }
    );
  }
};

export default ItemService;