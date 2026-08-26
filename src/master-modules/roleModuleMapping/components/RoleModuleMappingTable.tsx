import React from "react";

import type { Role } from "../types/roleModuleMappingTypes";

interface Props {
  roles: Role[];

  loading: boolean;

  onManage: (role: Role) => void;
}

const RoleModuleMappingTable = ({ roles, loading, onManage }: Props) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status" />

        <div className="mt-2">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>#</th>

            <th>Role</th>

            <th>Description</th>

            <th>Type</th>

            <th>Status</th>

            <th className="text-end">Action</th>
          </tr>
        </thead>

        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No roles found.
              </td>
            </tr>
          ) : (
            roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>

                <td>
                  <div className="fw-semibold">{role.roleName}</div>
                </td>

                <td>{role.description || "-"}</td>

                <td>
                  {role.isSuperAdmin ? (
                    <span className="badge bg-dark">Super Admin</span>
                  ) : (
                    <span className="badge bg-secondary">Role</span>
                  )}
                </td>

                <td>
                  {role.isActive ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </td>

                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => onManage(role)}
                    disabled={!role.isActive}
                  >
                    <i className="bi bi-key-fill me-1" />
                    Manage Modules
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleModuleMappingTable;
