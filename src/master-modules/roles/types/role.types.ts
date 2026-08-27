export interface Role {
  id: number;
  roleName: string;
  description: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

// POST /api/roles
export interface CreateRoleRequest {
  roleName: string;
  description: string;
  isSuperAdmin: boolean;
}

// PUT /api/roles/:roleId
export interface UpdateRoleRequest {
  roleName: string;
  description: string;
  isSuperAdmin: boolean;
  isActive: boolean;
}