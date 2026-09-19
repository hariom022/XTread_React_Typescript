import { apiRequest } from "../../../shared/services/apiClient";

import type {
  LoginRequest,
  LoginResponse,
  User,
  MyPermissionsApiResponse,
  RefreshTokenResponse
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
  /**
   * Refresh Token (hits POST /auth/refresh)
   */
  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiRequest<RefreshTokenResponse>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );
  },

  /**
   * Logout (hits POST /auth/logout)
   */
  async logout(refreshToken?: string): Promise<void> {
    return apiRequest<void>(
      "/auth/logout",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );
  },
};


export default authService;