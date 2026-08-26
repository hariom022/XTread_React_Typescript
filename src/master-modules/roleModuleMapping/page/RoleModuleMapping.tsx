import React, { useEffect, useState } from "react";

import RoleModuleMappingTable from "../components/RoleModuleMappingTable";

import RoleModuleMappingModal from "../components/RoleModuleMappingModal";

import { useRoleModuleMapping } from "../hooks/useRoleModuleMapping";

import moduleService from "../../../features/modules/services/moduleService";
import type{ ModuleItem } from "../../../features/modules/types/moduleTypes";


import type {
  Role,
} from "../types/roleModuleMappingTypes";

const RoleModuleMapping = () => {

  const {
    roles,
    loading,
    saving,
    loadRole,
    loadRolePermissions,
    savePermissions,
  } = useRoleModuleMapping();

  const [
    moduleTree,
    setModuleTree,
  ] = useState<ModuleItem[]>([]);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<Role | null>(null);

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    loadingModules,
    setLoadingModules,
  ] = useState(false);

  const [
    rolePermissions,
    setRolePermissions,
  ] = useState<any>(null);

  /**
   * =====================================================
   * LOAD MODULE TREE
   * =====================================================
   */

  useEffect(() => {

    const loadModules = async () => {

      try {

        setLoadingModules(true);

        const response =
          await moduleService.getModuleTree();

        if (
          response.success
        ) {

          setModuleTree(
            response.data.modules
          );

        }

      } catch (error) {

        console.error(
          "Failed to load module tree:",
          error
        );

      } finally {

        setLoadingModules(false);

      }

    };

    loadModules();

  }, []);

  /**
   * =====================================================
   * MANAGE ROLE
   * =====================================================
   */

  const handleManage = async (
    role: Role
  ) => {

    setSelectedRole(role);

    setShowModal(true);

    /*
     * Load role details.
     */
    await loadRole(
      role.id
    );

    /*
     * Load role permissions.
     */
    const permissions =
      await loadRolePermissions(
        role.id
      );

    setRolePermissions(
      permissions
    );

  };

  /**
   * =====================================================
   * SAVE
   * =====================================================
   */

  const handleSave = async (
    moduleIds: number[]
  ) => {

    if (!selectedRole) {
      return;
    }

    const success =
      await savePermissions(
        selectedRole.id,
        moduleIds
      );

    if (success) {

      alert(
        "Role module mapping saved successfully."
      );

      setShowModal(false);

    }

  };

  /**
   * =====================================================
   * CLOSE
   * =====================================================
   */

  const handleClose = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setSelectedRole(null);

    setRolePermissions(null);

  };

  return (
    <div className="container-fluid p-4">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div
        className="d-flex justify-content-between align-items-center mb-4"
      >

        <div>

          <h3 className="mb-1">
            Role Module Mapping
          </h3>

          <p className="text-muted mb-0">
            Manage module access for each role.
          </p>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="card shadow-sm">

        <div className="card-body">

          <RoleModuleMappingTable
            roles={roles}
            loading={loading}
            onManage={handleManage}
          />

        </div>

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (

        <RoleModuleMappingModal
          role={selectedRole}
          permissions={rolePermissions}
          modules={moduleTree}
          loading={
            loading ||
            loadingModules
          }
          saving={saving}
          onClose={handleClose}
          onSave={handleSave}
        />

      )}

    </div>
  );
};

export default RoleModuleMapping;