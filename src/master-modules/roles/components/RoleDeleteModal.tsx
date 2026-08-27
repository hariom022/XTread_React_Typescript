import type { Role } from "../types/role.types";

interface RoleDeleteModalProps {
  show: boolean;

  role: Role | null;

  loading: boolean;

  onClose: () => void;

  onDelete: () => Promise<void>;
}

const RoleDeleteModal = ({
  show,
  role,
  loading,
  onClose,
  onDelete,
}: RoleDeleteModalProps) => {

  if (!show || !role) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await onDelete();
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div
      className="role-modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="role-delete-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="role-delete-header">

          <div className="role-delete-icon">
            🗑
          </div>

          <div>
            <h3>
              Delete Role
            </h3>

            <p>
              This action cannot be undone.
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
            CONTENT
        ========================= */}

        <div className="role-delete-content">

          <p>
            Are you sure you want to delete
            this role?
          </p>

          <div className="role-delete-role">

            <span className="role-delete-label">
              Role
            </span>

            <span className="role-delete-name">
              {role.roleName}
            </span>

          </div>

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="role-delete-footer">

          <button
            type="button"
            className="role-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="role-delete-confirm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete Role"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RoleDeleteModal;