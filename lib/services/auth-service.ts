// lib/services/auth-service.ts
import { api } from "../api";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";

interface LoginRequestData {
  email: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

export const AuthService = {
  /**
   * Login user and store token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<TokenResponse>} - Promise with token
   */
  login: async (email: string, password: string): Promise<TokenResponse> => {
    try {
      const requestData: LoginRequestData = { email, password };
      const response = await api.post("/auth/login", requestData);
      
      // Store token in localStorage
      if (response && response.token) {
        localStorage.setItem("auth_token", response.token);
        
        // Fetch user data after login
        try {
          const userData = await api.get("/auth/me");
          if (userData) {
            const user: User = {
              id: userData.id,
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              email: userData.email,
              role: userData.role
            };
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (err) {
          console.error("Error fetching user data after login:", err);
        }
      }
      
      return response;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Logout user and remove token
   */
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    // Redirect to login
    window.location.href = "/login";
  },

  /**
   * Get current user data
   * @returns {Promise<User|null>} - User data or null if not logged in
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // First check if we have the user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      // If we have a token but no user, fetch the user data
      const token = localStorage.getItem("auth_token");
      if (token) {
        const userData = await api.get("/auth/me");
        
        // Convert backend data structure to match frontend User type
        const user: User = {
          id: userData.id,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email,
          role: userData.role
        };
        
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }
      
      return null;
    } catch (error) {
      // If the token is invalid, clear it
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  }
};

export default AuthService;