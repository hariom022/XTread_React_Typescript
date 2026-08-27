import {
  useEffect,
  useMemo,
  useState,
} from "react";

import roleService from "../service/roleService";

import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

const ITEMS_PER_PAGE = 10;

const useRoles = () => {

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  // =========================
  // LOAD ROLES
  // =========================

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await roleService.getAllRoles();

      if (response.data?.success) {
        setRoles(
          response.data.data || []
        );
      } else {
        setRoles([]);

        setError(
          response.data?.error?.message ||
            "Failed to load roles"
        );
      }
    } catch (err: any) {

      console.error(
        "Roles API Error:",
        err
      );

      setError(
        err?.response?.data?.error
          ?.message ||
          err?.response?.data
            ?.message ||
          err?.message ||
          "Failed to load roles"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE ROLE
  // =========================

  const createRole = async (
    data: CreateRoleRequest
  ) => {

    try {
      setActionLoading(true);
      setError(null);

      const response =
        await roleService.createRole(
          data
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.error
            ?.message ||
            "Failed to create role"
        );
      }

      await loadRoles();

    } catch (err: any) {

      const message =
        err?.response?.data?.error
          ?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create role";

      setError(message);

      throw err;

    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // UPDATE ROLE
  // =========================

  const updateRole = async (
    id: number,
    data: UpdateRoleRequest
  ) => {

    try {
      setActionLoading(true);
      setError(null);

      const response =
        await roleService.updateRole(
          id,
          data
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.error
            ?.message ||
            "Failed to update role"
        );
      }

      await loadRoles();

    } catch (err: any) {

      const message =
        err?.response?.data?.error
          ?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update role";

      setError(message);

      throw err;

    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // DELETE ROLE
  // =========================

  const deleteRole = async (
    id: number
  ) => {

    try {
      setActionLoading(true);
      setError(null);

      const response =
        await roleService.deleteRole(
          id
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.error
            ?.message ||
            "Failed to delete role"
        );
      }

      await loadRoles();

    } catch (err: any) {

      const message =
        err?.response?.data?.error
          ?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete role";

      setError(message);

      throw err;

    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadRoles();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredRoles =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return roles;
      }

      return roles.filter(
        (role) =>
          role.roleName
            ?.toLowerCase()
            .includes(search) ||

          role.description
            ?.toLowerCase()
            .includes(search) ||

          role.id
            .toString()
            .includes(search) ||

          (role.isSuperAdmin
            ? "yes"
            : "no"
          ).includes(search) ||

          (role.isActive
            ? "active"
            : "inactive"
          ).includes(search)
      );

    }, [
      roles,
      searchTerm,
    ]);

  // =========================
  // RESET PAGE
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // =========================
  // PAGINATION
  // =========================

  const totalItems =
    filteredRoles.length;

  const totalPages =
    Math.ceil(
      totalItems /
        ITEMS_PER_PAGE
    );

  const paginatedRoles =
    useMemo(() => {

      const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      return filteredRoles.slice(
        startIndex,
        startIndex +
          ITEMS_PER_PAGE
      );

    }, [
      filteredRoles,
      currentPage,
    ]);

  // =========================
  // PAGE CHANGE
  // =========================

  const handlePageChange = (
    page: number
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  return {
    roles,

    filteredRoles,

    paginatedRoles,

    loading,

    actionLoading,

    error,

    searchTerm,

    setSearchTerm,

    currentPage,

    totalPages,

    totalItems,

    itemsPerPage:
      ITEMS_PER_PAGE,

    handlePageChange,

    loadRoles,

    createRole,

    updateRole,

    deleteRole,
  };
};

export default useRoles;