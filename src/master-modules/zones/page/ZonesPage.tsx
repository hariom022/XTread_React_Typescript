
import { useState } from "react";
import ZoneTable from "../components/ZoneTable";
import useZones from "../hooks/useZones";
import type { ZonePayload } from "../types/zone.types";
import { RingLoader } from "react-spinners";
import "../styles/zones.css";

type ModalMode = "create" | "edit" | "view";

const initialForm: ZonePayload = {
  zoneName: "",
  zoneInitial: "",
  regionId: 0,
};

const ZonesPage = () => {
  const {
    regions,
    filteredZones,
    loading,
    saving,
    error,
    searchTerm,
    setSearchTerm,
    createZone,
    updateZone,
    deleteZone,
    getZoneById,
  } = useZones();

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ZonePayload>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const openCreate = () => {
    setMode("create");
    setSelectedId(null);
    setFormData(initialForm);
    setFormError(null);
    setShowModal(true);
  };

  const openZone = async (id: number, selectedMode: ModalMode) => {
    setMode(selectedMode);
    setSelectedId(id);
    setFormError(null);
    setFormData(initialForm);
    setShowModal(true);
    setActionLoading(true);

    try {
      const zone = await getZoneById(id);

      setFormData({
        zoneName: zone.zoneName,
        zoneInitial: zone.zoneInitial,
        regionId: zone.regionId,
      });
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Failed to load zone."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setFormError(null);

    const payload: ZonePayload = {
      zoneName: formData.zoneName.trim(),
      zoneInitial: formData.zoneInitial.trim(),
      regionId: Number(formData.regionId),
    };

    if (
      !payload.zoneName ||
      !payload.zoneInitial ||
      !payload.regionId ||
      payload.regionId <= 0
    ) {
      setFormError(
        "Please enter the zone name, zone initial, and select a region."
      );
      return;
    }

    try {
      if (mode === "create") {
        await createZone(payload);
      } else if (mode === "edit" && selectedId !== null) {
        await updateZone(selectedId, payload);
      }

      setShowModal(false);
      setSelectedId(null);
      setFormData(initialForm);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "The operation failed."
      );
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete zone ID ${id}?`
    );

    if (!confirmed) return;

    try {
      await deleteZone(id);
    } catch (err: unknown) {
      window.alert(
        err instanceof Error ? err.message : "Failed to delete zone."
      );
    }
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setSelectedId(null);
    setFormData(initialForm);
    setFormError(null);
  };

  const isReadOnly = mode === "view";

  const modalTitle = {
    create: "Create Zone",
    edit: "Edit Zone",
    view: "Zone Details",
  }[mode];

  return (
    <div className="zone-page">
      {/* PAGE HEADER */}
      <div className="zone-page-header">
        <div>
          <h2 className="zone-page-title">Zones</h2>
          <p className="zone-page-subtitle">
            Manage and view zone master data
          </p>
        </div>

        <div className="zone-filter-section">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">

            <div className="zone-search-wrapper">
              <span className="zone-search-icon">🔍</span>
              <input
                type="text"
                className="zone-search"
                placeholder="Search zone or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreate}
            >
              <i className="bi bi-plus-lg me-2" />
              Add Zone
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="zone-card">
        {error && <div className="zone-error">{error}</div>}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <RingLoader color="#b30815" size={80} />
          </div>
        ) : (
          <ZoneTable
            zones={filteredZones}
            onView={(id) => void openZone(id, "view")}
            onEdit={(id) => void openZone(id, "edit")}
            onDelete={(id) => void handleDelete(id)}
          />
        )}
      </div>

      {/* CREATE / EDIT / VIEW MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={saving}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger">
                      {formError}
                    </div>
                  )}

                  {actionLoading ? (
                    <div className="text-center py-4">
                      <RingLoader color="#b30815" size={45} />
                    </div>
                  ) : (
                    <>
                      {/* REGION DROPDOWN */}
                      <div className="mb-3">
                        <label
                          htmlFor="regionId"
                          className="form-label"
                        >
                          Region
                        </label>

                        <select
                          id="regionId"
                          className="form-select"
                          value={formData.regionId || ""}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              regionId: Number(e.target.value),
                            }))
                          }
                          disabled={isReadOnly}
                          required
                        >
                          <option value="">Select Region</option>

                          {regions.map((region) => (
                            <option
                              key={region.id}
                              value={region.id}
                            >
                              {region.regionName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* ZONE NAME */}
                      <div className="mb-3">
                        <label
                          htmlFor="zoneName"
                          className="form-label"
                        >
                          Zone Name
                        </label>

                        <input
                          type="text"
                          id="zoneName"
                          className="form-control"
                          placeholder="Enter zone name"
                          value={formData.zoneName}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              zoneName: e.target.value,
                            }))
                          }
                          required
                          maxLength={100}
                          readOnly={isReadOnly}
                        />
                      </div>

                      {/* ZONE INITIAL */}
                      <div className="mb-3">
                        <label
                          htmlFor="zoneInitial"
                          className="form-label"
                        >
                          Zone Initial
                        </label>

                        <input
                          type="text"
                          id="zoneInitial"
                          className="form-control"
                          placeholder="Enter zone initial"
                          value={formData.zoneInitial}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              zoneInitial: e.target.value,
                            }))
                          }
                          required
                          maxLength={10}
                          readOnly={isReadOnly}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    {isReadOnly ? "Close" : "Cancel"}
                  </button>

                  {!isReadOnly && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving || actionLoading}
                    >
                      {saving
                        ? "Saving..."
                        : mode === "create"
                          ? "Create Zone"
                          : "Update Zone"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonesPage;
