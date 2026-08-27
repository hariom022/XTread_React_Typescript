import type {
  UserRegistration,
  UserResponse,
  UserUpdate,
  RolesResponse,
} from "../types/userRegistration.type";

import { apiRequest } from "../../../shared/services/apiClient";

const userService = {
  // ============================================
  // GET ROLES
  // ============================================

  getRoles: () =>
    apiRequest<RolesResponse>("/roles", {
      method: "GET",
    }),

  // ============================================
  // CREATE USER
  // ============================================

  saveUser: (payload: UserRegistration) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // ============================================
  // GET USER LIST
  // ============================================

  getUserList: () =>
    apiRequest<UserResponse>("/users", {
      method: "GET",
    }),

  // ============================================
  // UPDATE USER
  // ============================================

  updateUser: (
    userId: string,
    payload: UserUpdate
  ) =>
    apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // ============================================
  // DELETE USER
  // ============================================

  deleteUser: (userId: string) =>
    apiRequest(`/users/${userId}`, {
      method: "DELETE",
    }),
};

export default userService;