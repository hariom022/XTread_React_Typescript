import api from "../../../shared/services/api";

import type {
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

const roleService = {
  // =========================
  // GET ALL ROLES
  // =========================

  getAllRoles: () =>
    api.get("/roles"),

  // =========================
  // GET ROLE BY ID
  // =========================

  getRoleById: (id: number) =>
    api.get(`/roles/${id}`),

  // =========================
  // CREATE ROLE
  // =========================

  createRole: (
    data: CreateRoleRequest
  ) =>
    api.post("/roles", data),

  // =========================
  // UPDATE ROLE
  // =========================

  updateRole: (
    id: number,
    data: UpdateRoleRequest
  ) =>
    api.put(`/roles/${id}`, data),

  // =========================
  // DELETE ROLE
  // =========================

  deleteRole: (id: number) =>
    api.delete(`/roles/${id}`),
};

export default roleService;