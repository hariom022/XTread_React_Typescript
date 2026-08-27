import type { Role } from "../types/role.types";

interface RoleTableProps {
  roles: Role[];

  onEdit: (role: Role) => void;

  onDelete: (role: Role) => void;
}

const RoleTable = ({ roles, onEdit, onDelete }: RoleTableProps) => {
  return (
    <div className="role-table-wrapper">
      <table className="table role-table mb-0">
        <thead>
          <tr>
            <th>#</th>

            <th>Role Name</th>

            <th>Description</th>

            <th>Super Admin</th>

            <th>Status</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan={6} className="role-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            roles.map((item) => (
              <tr key={item.id}>
                {/* ID */}

                <td>
                  <span className="role-id">{item.id}</span>
                </td>

                {/* ROLE NAME */}

                <td>
                  <span className="role-name">{item.roleName}</span>
                </td>

                {/* DESCRIPTION */}

                <td>
                  <span className="role-description">
                    {item.description || "-"}
                  </span>
                </td>

                {/* SUPER ADMIN */}

                <td>
                  {item.isSuperAdmin ? (
                    <span className="role-badge role-super-admin">Yes</span>
                  ) : (
                    <span className="role-badge role-normal">No</span>
                  )}
                </td>

                {/* STATUS */}

                <td>
                  {item.isActive ? (
                    <span className="role-badge role-active">Active</span>
                  ) : (
                    <span className="role-badge role-inactive">Inactive</span>
                  )}
                </td>

                {/* ACTION */}

                <td>
                  <div className="role-action-buttons">
                    {/* EDIT */}

                    <button
                      type="button"
                      className="role-action-button role-edit-button"
                      title="Edit Role"
                      onClick={() => onEdit(item)}
                    >
                      ✏️
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      className="role-action-button role-delete-button"
                      title="Delete Role"
                      onClick={() => onDelete(item)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleTable;
