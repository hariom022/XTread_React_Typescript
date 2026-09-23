import { useState } from "react";

import { RingLoader } from "react-spinners";

import RoleTable from "../components/RoleTable";
import RoleModal from "../components/RoleModal";
import RoleDeleteModal from "../components/RoleDeleteModal";
import useRoles from "../hooks/useRoles";

import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

import "../styles/roles.css";

const RolesPage = () => {
  const {
    paginatedRoles,

    loading,
    actionLoading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,

    createRole,
    updateRole,
    deleteRole,
  } = useRoles();

  // =========================
  // MODAL
  // =========================

  const [showModal, setShowModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // =========================
  // CREATE
  // =========================

  const handleCreate = () => {
    setSelectedRole(null);

    setShowModal(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (role: Role) => {
    setSelectedRole(role);

    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCloseModal = () => {
    if (actionLoading) {
      return;
    }

    setShowModal(false);

    setSelectedRole(null);
  };

  // =========================
  // CREATE
  // =========================

  const handleCreateRole = async (data: CreateRoleRequest) => {
    await createRole(data);

    setShowModal(false);

    setSelectedRole(null);
  };

  // =========================
  // UPDATE
  // =========================

  const handleUpdateRole = async (roleId: number, data: UpdateRoleRequest) => {
    await updateRole(roleId, data);

    setShowModal(false);

    setSelectedRole(null);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);

    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    if (actionLoading) {
      return;
    }

    setShowDeleteModal(false);

    setRoleToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!roleToDelete) {
      return;
    }

    await deleteRole(roleToDelete.id);

    setShowDeleteModal(false);

    setRoleToDelete(null);
  };

  return (
    <div className="role-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="role-page-header">
        <div>
          <h2 className="role-page-title">Roles</h2>

          <p className="role-page-subtitle">Manage and view role master data</p>
        </div>

        {/* =========================
            HEADER ACTIONS
        ========================= */}

        <div className="role-header-actions">
          {/* SEARCH */}

          <div className="role-search-wrapper">
            <span className="role-search-icon">🔍</span>

            <input
              type="text"
              className="role-search"
              placeholder="Search role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* CREATE */}

          <button
            type="button"
            className="role-create-button"
            onClick={handleCreate}
          >
            + Create Role
          </button>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="role-card">
        {/* ERROR */}

        {error && <div className="role-error">{error}</div>}

        {/* LOADING */}

        {loading ? (
          <div className="role-loader">
            <RingLoader color="#b30815" size={70} />
          </div>
        ) : (
          <>
            {/* TABLE */}

            <RoleTable
              roles={paginatedRoles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="role-pagination">
                {/* INFO */}

                <div className="role-pagination-info">
                  Showing{" "}
                  <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
                  <strong>
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </strong>{" "}
                  of <strong>{totalItems}</strong> records
                </div>

                {/* BUTTONS */}

                <div className="role-pagination-buttons">
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    className="role-page-button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ‹
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`role-page-button ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {/* NEXT */}

                  <button
                    type="button"
                    className="role-page-button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}

      <RoleModal
        show={showModal}
        role={selectedRole}
        loading={actionLoading}
        onClose={handleCloseModal}
        onCreate={handleCreateRole}
        onUpdate={handleUpdateRole}
      />
      <RoleDeleteModal
        show={showDeleteModal}
        role={roleToDelete}
        loading={actionLoading}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default RolesPage;
