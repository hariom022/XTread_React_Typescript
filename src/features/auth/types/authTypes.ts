export interface User {
  id: number;
  userName: string;
  email?: string;

  roleId: number;
  roleName: string;

  isSuperAdmin: boolean;
  isActive: boolean;
  fullName?:string;
}

export interface ModulePermission {
  moduleId: number;
  moduleCode: string;
  moduleName: string;

  route?: string;
  icon?: string;

  parentModuleId?: number | null;
  displayOrder?: number;
}

export interface LoginRequest {
  emailOrUserName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface MyPermissionsResponse {
  roleId: number;
  roleName: string;

  modules: ModulePermission[];
}

/**
 * Actual API response wrapper
 */
export interface MyPermissionsApiResponse {
  success: boolean;
  data: MyPermissionsResponse;
  error: string | null;
}