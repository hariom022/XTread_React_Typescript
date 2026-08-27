import { useEffect, useState } from "react";

import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

interface RoleModalProps {
  show: boolean;

  role: Role | null;

  loading: boolean;

  onClose: () => void;

  onCreate: (data: CreateRoleRequest) => Promise<void>;

  onUpdate: (roleId: number, data: UpdateRoleRequest) => Promise<void>;
}

const RoleModal = ({
  show,
  role,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: RoleModalProps) => {
  const isEdit = role !== null;

  // =========================
  // FORM STATE
  // =========================

  const [roleName, setRoleName] = useState("");

  const [description, setDescription] = useState("");

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState("");

  // =========================
  // LOAD FORM
  // =========================

  useEffect(() => {
    if (role) {
      setRoleName(role.roleName || "");

      setDescription(role.description || "");

      setIsSuperAdmin(role.isSuperAdmin);

      setIsActive(role.isActive);
    } else {
      setRoleName("");

      setDescription("");

      setIsSuperAdmin(false);

      setIsActive(true);
    }

    setFormError("");
  }, [role, show]);

  // =========================
  // DO NOT RENDER
  // =========================

  if (!show) {
    return null;
  }

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");

    // =========================
    // VALIDATION
    // =========================

    if (!roleName.trim()) {
      setFormError("Role name is required.");

      return;
    }

    try {
      // =========================
      // CREATE
      // =========================

      if (!isEdit) {
        const createData: CreateRoleRequest = {
          roleName: roleName.trim(),

          description: description.trim(),

          isSuperAdmin:false,
        };

        await onCreate(createData);

        return;
      }

      // =========================
      // UPDATE
      // =========================

      const updateData: UpdateRoleRequest = {
        roleName: roleName.trim(),

        description: description.trim(),

        isSuperAdmin:false,

        isActive,
      };

      await onUpdate(role.id, updateData);
    } catch (err: any) {
      setFormError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong.",
      );
    }
  };

  return (
    <div className="role-modal-overlay" onMouseDown={onClose}>
      <div className="role-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* =========================
            HEADER
        ========================= */}

        <div className="role-modal-header">
          <div>
            <h3>{isEdit ? "Edit Role" : "Create Role"}</h3>

            <p>
              {isEdit ? "Update role information" : "Create a new system role"}
            </p>
          </div>

          <button
            type="button"
            className="role-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form className="role-modal-form" onSubmit={handleSubmit}>
          {/* ERROR */}

          {formError && <div className="role-form-error">{formError}</div>}

          {/* ROLE NAME */}

          <div className="role-form-group">
            <label>
              Role Name
              <span>*</span>
            </label>

            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              maxLength={100}
              disabled={loading}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="role-form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
              rows={3}
              maxLength={500}
              disabled={loading}
            />
          </div>

          {/* SUPER ADMIN

          <div className="role-checkbox-group">
            <label className="role-checkbox-label">
              <input
                type="checkbox"
                checked={isSuperAdmin}
                onChange={(e) => setIsSuperAdmin(e.target.checked)}
                disabled={loading}
              />

              <span>Super Admin</span>
            </label>
          </div> */}

          {/* =========================
              ACTIVE
              ONLY SHOW ON EDIT
          ========================= */}

          {isEdit && (
            <div className="role-checkbox-group">
              <label className="role-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                />

                <span>Active</span>
              </label>
            </div>
          )}

          {/* =========================
              FOOTER
          ========================= */}

          <div className="role-modal-footer">
            <button
              type="button"
              className="role-modal-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="role-modal-save"
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
