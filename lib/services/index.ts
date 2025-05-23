// lib/services/index.ts
export * from './auth-service';
export * from './shop-service';
export * from './user-service';
export * from './employee-service';
export * from './item-service';

// Import individual services
import AuthService from './auth-service';
import ShopService from './shop-service';
import UserService from './user-service';
import EmployeeService from './employee-service';
import ItemService from './item-service';

// Export as default object with all services
export default {
  auth: AuthService,
  shop: ShopService,
  user: UserService,
  employee: EmployeeService,
  item: ItemService,
};