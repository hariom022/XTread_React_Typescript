import React, { useEffect, useState } from "react";



import type{ ModuleItem } from "../../../features/modules/types/moduleTypes";
import type {
  Role,
  RolePermissionsData,
} from "../types/roleModuleMappingTypes";

interface Props {
  role: Role | null;

  permissions:
    | RolePermissionsData
    | null;

  modules: ModuleItem[];

  loading: boolean;

  saving: boolean;

  onClose: () => void;

  onSave: (
    moduleIds: number[]
  ) => Promise<void>;
}

const RoleModuleMappingModal = ({
  role,
  permissions,
  modules,
  loading,
  saving,
  onClose,
  onSave,
}: Props) => {

  const [
    selectedModuleIds,
    setSelectedModuleIds,
  ] = useState<number[]>([]);

  /**
   * =====================================================
   * LOAD EXISTING PERMISSIONS
   * =====================================================
   */

  useEffect(() => {

    if (!permissions) {
      setSelectedModuleIds([]);
      return;
    }

    setSelectedModuleIds(
      permissions.modules.map(
        (module) =>
          module.moduleId
      )
    );

  }, [permissions]);

  /**
   * =====================================================
   * CHECKBOX
   * =====================================================
   */

  const toggleModule = (
    moduleId: number,
    checked: boolean
  ) => {

    setSelectedModuleIds(
      (previous) => {

        if (checked) {

          if (
            previous.includes(moduleId)
          ) {
            return previous;
          }

          return [
            ...previous,
            moduleId,
          ];
        }

        return previous.filter(
          (id) =>
            id !== moduleId
        );

      }
    );
  };

  /**
   * =====================================================
   * PARENT MODULE
   * =====================================================
   */

  const toggleParent = (
    module: ModuleItem,
    checked: boolean
  ) => {

    const childIds =
      module.children
        ?.filter(
          (child) =>
            child.isActive
        )
        .map(
          (child) =>
            child.id
        ) || [];

    if (checked) {

      setSelectedModuleIds(
        (previous) => [
          ...new Set([
            ...previous,
            module.id,
            ...childIds,
          ]),
        ]
      );

    } else {

      setSelectedModuleIds(
        (previous) =>
          previous.filter(
            (id) =>
              id !== module.id &&
              !childIds.includes(id)
          )
      );

    }
  };

  /**
   * =====================================================
   * SAVE
   * =====================================================
   */

  const handleSave = async () => {

    if (!role) {
      return;
    }

    await onSave(
      selectedModuleIds
    );

  };

  if (!role) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      style={{
        background:
          "rgba(0,0,0,.55)",
      }}
    >

      <div
        className="modal-dialog modal-lg modal-dialog-centered"
      >

        <div className="modal-content">

          {/* HEADER */}

          <div className="modal-header">

            <div>

              <h5 className="modal-title">
                Role Module Mapping
              </h5>

              <small className="text-muted">
                {role.roleName}
              </small>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            />

          </div>

          {/* BODY */}

          <div className="modal-body">

            {loading ? (

              <div className="text-center py-5">

                <div
                  className="spinner-border"
                  role="status"
                />

                <div className="mt-2">
                  Loading modules...
                </div>

              </div>

            ) : (

              <div
                className="border rounded"
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >

                {modules
                  .filter(
                    (module) =>
                      module.isActive
                  )
                  .sort(
                    (a, b) =>
                      a.displayOrder -
                      b.displayOrder
                  )
                  .map(
                    (module) => {

                      const children =
                        module.children
                          ?.filter(
                            (child) =>
                              child.isActive
                          )
                          .sort(
                            (a, b) =>
                              a.displayOrder -
                              b.displayOrder
                          ) || [];

                      const allChildrenSelected =
                        children.length > 0 &&
                        children.every(
                          (child) =>
                            selectedModuleIds.includes(
                              child.id
                            )
                        );

                      return (
                        <div
                          key={module.id}
                          className="border-bottom"
                        >

                          {/* PARENT */}

                          <div className="p-3 bg-light">

                            <div className="form-check">

                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`module-${module.id}`}
                                checked={
                                  selectedModuleIds.includes(
                                    module.id
                                  ) ||
                                  allChildrenSelected
                                }
                                onChange={(e) =>
                                  toggleParent(
                                    module,
                                    e.target.checked
                                  )
                                }
                              />

                              <label
                                className="form-check-label fw-semibold"
                                htmlFor={`module-${module.id}`}
                              >

                                <i
                                  className={
                                    module.icon ||
                                    "bi bi-folder"
                                  }
                                />

                                <span className="ms-2">
                                  {module.moduleName}
                                </span>

                              </label>

                            </div>

                          </div>

                          {/* CHILDREN */}

                          <div className="px-4 py-2">

                            {children.map(
                              (child) => (

                                <div
                                  key={
                                    child.id
                                  }
                                  className="form-check mb-2"
                                >

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`module-${child.id}`}
                                    checked={selectedModuleIds.includes(
                                      child.id
                                    )}
                                    onChange={(e) =>
                                      toggleModule(
                                        child.id,
                                        e.target.checked
                                      )
                                    }
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor={`module-${child.id}`}
                                  >

                                    <i
                                      className={
                                        child.icon ||
                                        "bi bi-circle"
                                      }
                                    />

                                    <span className="ms-2">
                                      {
                                        child.moduleName
                                      }
                                    </span>

                                  </label>

                                </div>

                              )
                            )}

                          </div>

                        </div>
                      );

                    }
                  )}

              </div>

            )}

          </div>

          {/* FOOTER */}

          <div className="modal-footer">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={
                saving ||
                loading
              }
            >

              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  />

                  Saving...
                </>
              ) : (
                "Save Mapping"
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RoleModuleMappingModal;