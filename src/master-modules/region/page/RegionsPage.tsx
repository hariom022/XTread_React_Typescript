
import { useState } from "react";
import RegionTable from "../components/RegionTable";
import useRegions from "../hooks/useRegions";
import type { RegionPayload } from "../types/region.types";
import { RingLoader } from "react-spinners";
import "../styles/regions.css";

type ModalMode = "create" | "edit" | "view";

const initialForm: RegionPayload = {
  regionName: "",
  regionInitial: "",
};

const RegionsPage = () => {
  const {
    filteredRegions,
    loading,
    saving,
    error,
    searchTerm,
    setSearchTerm,
    createRegion,
    updateRegion,
    deleteRegion,
    getRegionById,
  } = useRegions();

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RegionPayload>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const openCreate = () => {
    setMode("create");
    setSelectedId(null);
    setFormData(initialForm);
    setFormError(null);
    setShowModal(true);
  };

  const openRegion = async (id: number, selectedMode: ModalMode) => {
    try {
      setActionLoading(true);
      setFormError(null);

      const region = await getRegionById(id);

      setSelectedId(id);
      setMode(selectedMode);
      setFormData({
        regionName: region.regionName,
        regionInitial: region.regionInitial,
      });
      setShowModal(true);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Failed to load region."
      );
      setShowModal(true);
      setMode(selectedMode);
      setSelectedId(id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const payload: RegionPayload = {
      regionName: formData.regionName.trim(),
      regionInitial: formData.regionInitial.trim(),
    };

    if (!payload.regionName || !payload.regionInitial) {
      setFormError("Please enter the region name and region initial.");
      return;
    }

    try {
      if (mode === "create") {
        await createRegion(payload);
      } else if (mode === "edit" && selectedId !== null) {
        await updateRegion(selectedId, payload);
      }

      setShowModal(false);
      setFormData(initialForm);
      setSelectedId(null);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "The operation failed."
      );
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete region ID ${id}?`
    );

    if (!confirmed) return;

    try {
      await deleteRegion(id);
    } catch (err: unknown) {
      window.alert(
        err instanceof Error ? err.message : "Failed to delete region."
      );
    }
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setFormError(null);
    setSelectedId(null);
    setFormData(initialForm);
  };

  const isReadOnly = mode === "view";

  const modalTitle = {
    create: "Create Region",
    edit: "Edit Region",
    view: "Region Details",
  }[mode];

  return (
    <div className="region-page">
      {/* PAGE HEADER */}
      <div className="region-page-header">
        <div>
          <h2 className="region-page-title">Regions</h2>
          <p className="region-page-subtitle">
            Manage and view region master data
          </p>
        </div>

        <div className="region-filter-section">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div className="region-search-wrapper">
              <span className="region-search-icon">🔍</span>
              <input
                type="text"
                className="region-search"
                placeholder="Search region..."
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
              Add Region
            </button>
          </div>
        </div>
      </div>

      {/* REGION CARD */}
      <div className="region-card">
        {error && <div className="region-error">{error}</div>}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <RingLoader color="#b30815" size={80} />
          </div>
        ) : (
          <RegionTable
            regions={filteredRegions}
            onView={(id) => void openRegion(id, "view")}
            onEdit={(id) => void openRegion(id, "edit")}
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
                      <div className="mb-3">
                        <label
                          htmlFor="regionName"
                          className="form-label"
                        >
                          Region Name
                        </label>

                        <input
                          type="text"
                          id="regionName"
                          className="form-control"
                          placeholder="Enter region name"
                          value={formData.regionName}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              regionName: e.target.value,
                            }))
                          }
                          required
                          maxLength={100}
                          readOnly={isReadOnly}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="regionInitial"
                          className="form-label"
                        >
                          Region Initial
                        </label>

                        <input
                          type="text"
                          id="regionInitial"
                          className="form-control"
                          placeholder="Enter region initial"
                          value={formData.regionInitial}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              regionInitial: e.target.value,
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
                          ? "Create Region"
                          : "Update Region"}
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

export default RegionsPage;
