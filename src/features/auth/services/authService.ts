import { apiRequest } from "../../../shared/services/apiClient";

import type {
  LoginRequest,
  LoginResponse,
  User,
  MyPermissionsApiResponse,
} from "../types/authTypes";

const authService = {
  /**
   * Login
   */
  async login(
    data: LoginRequest
  ): Promise<LoginResponse> {
    return apiRequest<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Get currently logged-in user
   */
  async getMe(): Promise<User> {
    return apiRequest<User>(
      "/auth/me"
    );
  },

  /**
   * Get modules assigned to
   * currently logged-in user's role
   */
  async getMyPermission(): Promise<MyPermissionsApiResponse> {
    return apiRequest<MyPermissionsApiResponse>(
      "/auth/my-permissions"
    );
  },
};

export default authService;