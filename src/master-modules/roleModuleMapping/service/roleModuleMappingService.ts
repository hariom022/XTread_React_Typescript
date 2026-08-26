import { apiRequest } from "../../../shared/services/apiClient";

import type {
  RoleListResponse,
  RoleResponse,
  RolePermissionsResponse,
  SaveRolePermissionsRequest,
  SaveRolePermissionsResponse,
} from "../types/roleModuleMappingTypes";

const roleModuleMappingService = {

  /**
   * GET /api/roles
   */
  async getRoles(): Promise<RoleListResponse> {
    return apiRequest<RoleListResponse>(
      "/roles"
    );
  },

  /**
   * GET /api/roles/{roleId}
   */
  async getRole(
    roleId: number
  ): Promise<RoleResponse> {
    return apiRequest<RoleResponse>(
      `/roles/${roleId}`
    );
  },

  /**
   * GET /api/roles/{roleId}/permissions
   */
  async getRolePermissions(
    roleId: number
  ): Promise<RolePermissionsResponse> {
    return apiRequest<RolePermissionsResponse>(
      `/roles/${roleId}/permissions`
    );
  },

  /**
   * POST /api/roles/{roleId}/permissions
   */
  async saveRolePermissions(
    roleId: number,
    data: SaveRolePermissionsRequest
  ): Promise<SaveRolePermissionsResponse> {
    return apiRequest<SaveRolePermissionsResponse>(
      `/roles/${roleId}/permissions`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};

export default roleModuleMappingService;