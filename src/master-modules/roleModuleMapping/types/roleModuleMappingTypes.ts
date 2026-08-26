export interface Role {
  id: number;
  roleName: string;
  description: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface RoleListResponse {
  success: boolean;
  data: Role[];
  error: string | null;
}

export interface RoleResponse {
  success: boolean;
  data: Role;
  error: string | null;
}

export interface RolePermissionModule {
  moduleId: number;
  moduleCode: string;
  moduleName: string;
  parentModuleId: number | null;
  route: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface RolePermissionsData {
  roleId: number;
  roleName: string;
  modules: RolePermissionModule[];
}

export interface RolePermissionsResponse {
  success: boolean;
  data: RolePermissionsData;
  error: string | null;
}

export interface SaveRolePermissionsRequest {
  moduleIds: number[];
}

export interface SaveRolePermissionsResponse {
  success: boolean;
  data: unknown;
  error: string | null;
}