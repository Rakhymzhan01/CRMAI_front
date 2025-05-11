// lib/services/auth-service.ts
import { api } from "../api";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";

interface LoginResponse {
  token: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

// Match your backend's expected format for registration
interface RegisterRequestData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
}

export const AuthService = {
  /**
   * Login user and store token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<LoginResponse>} - Promise with token and user data
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      // Format the request data according to your backend expectations
      const requestData = { email, password };
      
      // Log the request for debugging
      console.log("Login request:", { email, password: "***" });
      
      const response = await api.post("/auth/login", requestData);
      
      // Log the response for debugging
      console.log("Login response:", response);
      
      // Store token in localStorage
      if (response && response.token) {
        localStorage.setItem("auth_token", response.token);
        
        // Create user object from response or fetch user data
        let userData: User;
        
        if (response.user) {
          // If the backend includes user data in the login response
          userData = {
            id: response.user.id,
            firstName: response.user.first_name || '',
            lastName: response.user.last_name || '',
            email: response.user.email,
            role: response.user.role
          };
        } else {
          // Fetch user data if not included in login response
          try {
            const userResponse = await api.get("/auth/me");
            userData = {
              id: userResponse.id,
              firstName: userResponse.first_name || '',
              lastName: userResponse.last_name || '',
              email: userResponse.email,
              role: userResponse.role
            };
          } catch (err) {
            console.error("Error fetching user data after login:", err);
            throw new Error("Failed to retrieve user data");
          }
        }
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("No token received from server");
      }
      
      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide more informative error messages
      if (error.statusCode === 401) {
        throw new Error("Invalid email or password. Please try again.");
      }
      
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<User>} - Newly created user
   */
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> => {
    try {
      // Transform frontend data to match backend expectations
      const requestData: RegisterRequestData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user', // Default to 'user' if no role specified
      };
      
      // Log the request for debugging (without password)
      console.log("Registration request:", {
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        email: requestData.email,
        role: requestData.role
      });
      
      // Make API call to register endpoint
      const response = await api.post("/auth/register", requestData);
      
      // Log the response for debugging
      console.log("Registration response:", response);
      
      // Transform the response to match our User type
      const user: User = {
        id: response.id,
        firstName: response.first_name || userData.firstName,
        lastName: response.last_name || userData.lastName,
        email: response.email,
        role: response.role || 'user',
      };
      
      return user;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Provide more specific error messages based on status codes
      if (error.statusCode === 409) {
        throw new Error("Email already exists. Please use a different email address.");
      }
      
      throw error;
    }
  },

  /**
   * Logout user and remove token
   */
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
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
        try {
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
        } catch (error) {
          // If fetching user data fails, clear the token and return null
          console.error("Error fetching user data:", error);
          localStorage.removeItem("auth_token");
          return null;
        }
      }
      
      return null;
    } catch (error) {
      // If any error occurs, clear authentication data
      console.error("Error in getCurrentUser:", error);
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