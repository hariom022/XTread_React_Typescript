import { useEffect, useState } from "react";

import userService from "../service/userService";

import type {
  UserRegistration,
  Role,
} from "../types/userRegistration.type";

import useUserRegistration from "../hooks/useUserRegistration";

const UserRegistrationForm = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const [formData, setFormData] = useState<UserRegistration>({
    fullname: "",
    username: "",
    roleId: 0,
    email: "",
    phoneNumber: "",
    password: "",
    emailConfirmed: false,
  });

  const {
    registerUser,
    loading,
    error,
    successMessage,
  } = useUserRegistration();

  // Load roles when component loads
  useEffect(() => {
    loadRoles();
  }, []);

  // Get roles from API
 const loadRoles = async () => {
  try {
    setRolesLoading(true);

    const response =
      await userService.getRoles();

    console.log(
      "Roles response:",
      response
    );

    setRoles(response.data);
  } catch (err) {
    console.error(
      "Failed to load roles:",
      err
    );
  } finally {
    setRolesLoading(false);
  }
};

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((previous) => ({
      ...previous,

      // Checkbox returns boolean
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "roleId"
            ? Number(value)
            : value,
    }));
  };

  // Submit registration form
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // Validate role
    if (formData.roleId === 0) {
      alert("Please select a role.");
      return;
    }

    try {
      await registerUser(formData);

      // Reset form after successful registration
      resetForm();
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullname: "",
      username: "",
      roleId: 0,
      email: "",
      phoneNumber: "",
      password: "",
      emailConfirmed: false,
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">

        {/* Header */}
        <div className="card-header">
          <h4 className="mb-0">User Registration</h4>
        </div>

        {/* Body */}
        <div className="card-body">

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* Full Name */}
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="fullname"
                  className="form-label"
                >
                  Full Name
                </label>

                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="form-control"
                  placeholder="Enter full name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username */}
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="username"
                  className="form-label"
                >
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="email"
                  className="form-label"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="phoneNumber"
                  className="form-label"
                >
                  Phone Number
                </label>

                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role */}
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="roleId"
                  className="form-label"
                >
                  Role
                </label>

                <select
                  id="roleId"
                  name="roleId"
                  className="form-select"
                  value={formData.roleId}
                  onChange={handleChange}
                  required
                  disabled={rolesLoading}
                >
                  <option value={0}>
                    {rolesLoading
                      ? "Loading roles..."
                      : "Select Role"}
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="password"
                  className="form-label"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Confirmed */}
              <div className="col-md-4 mb-3 mt-4">
                <div className="form-check">

                  <input
                    type="checkbox"
                    id="emailConfirmed"
                    name="emailConfirmed"
                    className="form-check-input"
                    checked={formData.emailConfirmed}
                    onChange={handleChange}
                  />

                  <label
                    htmlFor="emailConfirmed"
                    className="form-check-label"
                  >
                    Email Confirmed
                  </label>

                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-3">

              {/* Reset */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>

              {/* Register */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Registering..."
                  : "Register User"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationForm;