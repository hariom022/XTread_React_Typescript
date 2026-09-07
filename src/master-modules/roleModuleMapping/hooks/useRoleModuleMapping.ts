import { useCallback, useEffect, useState } from "react";

import roleModuleMappingService from "../service/roleModuleMappingService";

import type {
  Role,
  RolePermissionsData,
} from "../types/roleModuleMappingTypes";

export const useRoleModuleMapping = () => {

  const [roles, setRoles] = useState<Role[]>([]);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  const [rolePermissions, setRolePermissions] =
    useState<RolePermissionsData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * =====================================================
   * LOAD ROLES
   * =====================================================
   */
  const loadRoles = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await roleModuleMappingService.getRoles();

      if (!response.success) {
        throw new Error(
          response.error ||
          "Failed to load roles"
        );
      }

      setRoles(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Failed to load roles:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load roles"
      );

    } finally {

      setLoading(false);

    }

  }, []);

  /**
   * =====================================================
   * LOAD ROLE DETAILS
   * =====================================================
   */
  const loadRole = useCallback(
    async (roleId: number) => {

      try {

        setLoading(true);
        setError(null);

        const response =
          await roleModuleMappingService.getRole(
            roleId
          );

        if (!response.success) {
          throw new Error(
            response.error ||
            "Failed to load role"
          );
        }

        setSelectedRole(
          response.data
        );

        return response.data;

      } catch (error) {

        console.error(
          "Failed to load role:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load role"
        );

        return null;

      } finally {

        setLoading(false);

      }

    },
    []
  );

  /**
   * =====================================================
   * LOAD ROLE PERMISSIONS
   * =====================================================
   */
  const loadRolePermissions =
    useCallback(
      async (roleId: number) => {

        try {

          setLoading(true);
          setError(null);

          const response =
            await roleModuleMappingService
              .getRolePermissions(
                roleId
              );

          if (!response.success) {
            throw new Error(
              response.error ||
              "Failed to load permissions"
            );
          }

          setRolePermissions(
            response.data
          );

          return response.data;

        } catch (error) {

          console.error(
            "Failed to load role permissions:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load permissions"
          );

          return null;

        } finally {

          setLoading(false);

        }

      },
      []
    );

  /**
   * =====================================================
   * SAVE ROLE PERMISSIONS
   * =====================================================
   */
  const savePermissions =
    useCallback(
      async (
        roleId: number,
        moduleIds: number[]
      ) => {

        try {

          setSaving(true);
          setError(null);

          const response =
            await roleModuleMappingService
              .saveRolePermissions(
                roleId,
                {
                  moduleIds,
                }
              );

          if (!response.success) {
            throw new Error(
              response.error ||
              "Failed to save permissions"
            );
          }

          /*
           * Reload permissions after save.
           */
          await loadRolePermissions(
            roleId
          );

          return true;

        } catch (error) {

          console.error(
            "Failed to save permissions:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to save permissions"
          );

          return false;

        } finally {

          setSaving(false);

        }

      },
      [loadRolePermissions]
    );

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,

    selectedRole,

    rolePermissions,

    loading,

    saving,

    error,

    loadRoles,

    loadRole,

    loadRolePermissions,

    savePermissions,

    setSelectedRole,

    setRolePermissions,
  };
};