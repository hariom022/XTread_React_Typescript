import { useEffect, useMemo, useState } from "react";

import useUserRegistration from "../hooks/useUserRegistration";

import type { User, UserUpdate, Role } from "../types/userRegistration.type";

import userService from "../service/userService";

const UserListTable = () => {
  const { loading, error, userList, getUserList, updateUser, deleteUser } =
    useUserRegistration();

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);

  const [rolesLoading, setRolesLoading] = useState(false);

  const [editFormData, setEditFormData] = useState<UserUpdate>({
    fullname: "",
    username: "",
    roleId: 0,
    email: "",
    phoneNumber: "",
    emailConfirmed: false,
  });

  const recordsPerPage = 10;

  // ============================================
  // LOAD USERS
  // ============================================

  useEffect(() => {
    getUserList();
  }, []);

  // ============================================
  // SEARCH
  // ============================================

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return userList;
    }

    return userList.filter((user) => {
      const fullName = String(user.fullName ?? "").toLowerCase();

      const userName = String(user.userName ?? "").toLowerCase();

      const email = String(user.email ?? "").toLowerCase();

      const phoneNumber = String(user.phoneNumber ?? "").toLowerCase();

      const roleName = String(user.roleName ?? "").toLowerCase();

      return (
        fullName.includes(search) ||
        userName.includes(search) ||
        email.includes(search) ||
        phoneNumber.includes(search) ||
        roleName.includes(search)
      );
    });
  }, [userList, searchTerm]);

  // ============================================
  // PAGINATION
  // ============================================

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;

  const endIndex = startIndex + recordsPerPage;

  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // ============================================
  // SEARCH CHANGE
  // ============================================

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // ============================================
  // PAGE CHANGE
  // ============================================

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // ============================================
  // LOAD ROLES
  // ============================================

  const loadRoles = async () => {
    try {
      setRolesLoading(true);

      const response = await userService.getRoles();

      setRoles(response.data);
    } catch (err) {
      console.error("Failed to load roles:", err);
    } finally {
      setRolesLoading(false);
    }
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================

  const handleEdit = async (user: User) => {
    try {
      setSelectedUser(user);

      // Load roles only if they are not already loaded
      let availableRoles = roles;

      if (availableRoles.length === 0) {
        const response = await userService.getRoles();

        availableRoles = response.data;

        setRoles(availableRoles);
      }

      console.log("Selected user:", user);

      console.log("Available roles:", availableRoles);

      const userRole = availableRoles.find(
        (role) => role.roleName === user.roleName,
      );

      console.log("Selected user role:", userRole);

      setEditFormData({
        fullname: user.fullName ?? "",
        username: user.userName ?? "",
        roleId: userRole?.id ?? 0,
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        emailConfirmed: user.emailConfirmed ?? false,
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Failed to open edit user:", err);
    }
  };

  // ============================================
  // EDIT INPUT CHANGE
  // ============================================

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setEditFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "roleId"
            ? Number(value)
            : value,
    }));
  };

  // ============================================
  // UPDATE USER
  // ============================================

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser) {
      return;
    }

    if (editFormData.roleId === 0) {
      alert("Please select a role.");
      return;
    }

    try {
      await updateUser(selectedUser.userId, editFormData);

      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  // ============================================
  // DELETE USER
  // ============================================

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log("Deleting user:", userId);

      await deleteUser(userId);

      if (currentPage > 1 && currentUsers.length === 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading && userList.length === 0) {
    return (
      <div className="card shadow-sm mt-4">
        <div className="card-body text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-3 mb-0">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ============================================
          USER TABLE
      ============================================ */}

      <div className="card shadow-sm mt-4">
        {/* HEADER */}

        <div className="card-header bg-white border-0 pt-4 px-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Users</h4>

              <p className="text-muted mb-0">
                Manage and view registered users
              </p>
            </div>

            {/* SEARCH */}

            <div style={{ width: "320px" }}>
              <div className="input-group">
                <span className="input-group-text bg-white">🔍</span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="px-4 pt-3">
            <div className="alert alert-danger mb-0">{error}</div>
          </div>
        )}

        {/* TABLE */}

        <div className="card-body px-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="ps-4">#</th>

                  <th>Full Name</th>

                  <th>Username</th>

                  <th>Role</th>

                  <th>Email</th>

                  <th>Phone Number</th>

                  <th>Email Confirmed</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={user.userId}>
                      <td className="ps-4">{startIndex + index + 1}</td>

                      <td>{user.fullName}</td>

                      <td>{user.userName}</td>

                      <td>
                        <span className="badge bg-light text-dark">
                          {user.roleName}
                        </span>
                      </td>

                      <td>{user.email}</td>

                      <td>{user.phoneNumber}</td>

                      <td>
                        {user.emailConfirmed ? (
                          <span className="badge bg-success">Confirmed</span>
                        ) : (
                          <span className="badge bg-secondary">
                            Not Confirmed
                          </span>
                        )}
                      </td>

                      {/* ACTION */}

                      <td>
                        <div className="d-flex gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => handleEdit(user)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDelete(user.userId)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      {searchTerm
                        ? "No users found matching your search."
                        : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}

        <div className="card-footer bg-white border-0 px-4 pb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing {filteredUsers.length === 0 ? 0 : startIndex + 1}
              {" - "}
              {Math.min(endIndex, filteredUsers.length)}
              {" of "}
              {filteredUsers.length}
            </div>

            {/* PAGINATION */}

            {totalPages > 0 && (
              <div className="d-flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`btn btn-sm ${
                      currentPage === page
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          EDIT MODAL
      ============================================ */}

      {showEditModal && selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* MODAL HEADER */}

              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>

              {/* MODAL BODY */}

              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="row">
                    {/* FULL NAME */}

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editFullname" className="form-label">
                        Full Name
                      </label>

                      <input
                        type="text"
                        id="editFullname"
                        name="fullname"
                        className="form-control"
                        value={editFormData.fullname}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* USERNAME */}

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editUsername" className="form-label">
                        Username
                      </label>

                      <input
                        type="text"
                        id="editUsername"
                        name="username"
                        className="form-control"
                        value={editFormData.username}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editEmail" className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        id="editEmail"
                        name="email"
                        className="form-control"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* PHONE */}

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editPhoneNumber" className="form-label">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        id="editPhoneNumber"
                        name="phoneNumber"
                        className="form-control"
                        value={editFormData.phoneNumber}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* ROLE */}

                    <div className="col-md-6 mb-3">
                      <label htmlFor="editRoleId" className="form-label">
                        Role
                      </label>

                      <select
                        id="editRoleId"
                        name="roleId"
                        className="form-select"
                        value={editFormData.roleId}
                        onChange={handleEditChange}
                        disabled={rolesLoading}
                        required
                      >
                        <option value={0}>
                          {rolesLoading ? "Loading roles..." : "Select Role"}
                        </option>

                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.roleName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* EMAIL CONFIRMED */}

                    <div className="col-md-6 mb-3 mt-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="editEmailConfirmed"
                          name="emailConfirmed"
                          className="form-check-input"
                          checked={editFormData.emailConfirmed}
                          onChange={handleEditChange}
                        />

                        <label
                          htmlFor="editEmailConfirmed"
                          className="form-check-label"
                        >
                          Email Confirmed
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL FOOTER */}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserListTable;
