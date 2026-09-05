import { useState } from "react";

import CourierServiceForm from "../components/CourierServiceForm";

import CourierServiceTable from "../components/CourierServiceTable";

import useCourierServices from "../hooks/useCourierServices";

import type {
    CourierService,
    CreateCourierServiceRequest,
    UpdateCourierServiceRequest,
} from "../types/courierServices.type";

const CourierServices = () => {
    /*
     * ==========================================================
     * TABLE FILTER
     *
     * null = All Courier Types
     * 1    = External Courier
     * 2    = Internal Courier
     * ==========================================================
     */

    const [
        selectedCourierType,
        setSelectedCourierType,
    ] = useState<number | null>(null);

    /*
     * ==========================================================
     * HOOK
     * ==========================================================
     */

    const {
        courierServices,
        loading,
        error,
        submitting,
        createCourierService,
        updateCourierService,
        deleteCourierService,
        getCourierServiceById,
        reload,
    } = useCourierServices(
        selectedCourierType
    );

    /*
     * ==========================================================
     * EDITING
     * ==========================================================
     */

    const [
        editingCourierService,
        setEditingCourierService,
    ] = useState<CourierService | null>(null);

    /*
     * ==========================================================
     * SEARCH
     * ==========================================================
     */

    const [
        searchTerm,
        setSearchTerm,
    ] = useState<string>("");

    /*
     * ==========================================================
     * TABLE FILTER CHANGE
     * ==========================================================
     */

    const handleCourierTypeFilterChange = (
        courierType: number | null
    ) => {
        setSelectedCourierType(
            courierType
        );

        /*
         * Clear search when filter changes
         */

        setSearchTerm("");
    };

    /*
     * ==========================================================
     * CREATE
     * ==========================================================
     */

    const handleCreate = async (
        request: CreateCourierServiceRequest
    ) => {
        await createCourierService(
            request
        );

        setEditingCourierService(null);
    };

    /*
     * ==========================================================
     * EDIT
     * ==========================================================
     */

    const handleEdit = async (
        service: CourierService
    ) => {
        try {
            const details =
                await getCourierServiceById(
                    service.courierServiceId
                );

            /*
             * Keep the existing table filter.
             *
             * Do NOT change the table filter when
             * opening the edit form.
             */

            setEditingCourierService(
                details
            );

            /*
             * Scroll to form
             */

            requestAnimationFrame(() => {
                document
                    .getElementById("courier-service-form")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
            });
        } catch (err) {
            console.error(
                "Failed to load courier service details:",
                err
            );
        }
    };

    /*
     * ==========================================================
     * UPDATE
     * ==========================================================
     */

    const handleUpdate = async (
        courierServiceId: number,
        request: UpdateCourierServiceRequest
    ) => {
        await updateCourierService(
            courierServiceId,
            request
        );

        /*
         * Keep current table filter.
         *
         * If user selected All, updated data will
         * still be visible if applicable.
         */

        setEditingCourierService(null);
    };

    /*
     * ==========================================================
     * CANCEL EDIT
     * ==========================================================
     */

    const handleCancelEdit = () => {
        setEditingCourierService(null);
    };

    /*
     * ==========================================================
     * DELETE
     * ==========================================================
     */

    const handleDelete = async (
        service: CourierService
    ) => {
        try {
            await deleteCourierService(
                service.courierServiceId
            );
        } catch (err) {
            console.error(
                "Failed to delete courier service:",
                err
            );
        }
    };

    return (
        <div
            className="container-fluid py-3"
            style={{
                background: "#f5f7fa",
                minHeight: "100vh",
            }}
        >
            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm">
                    <div>
                        <i className="bi bi-exclamation-triangle me-2" />
                        {error}
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={reload}
                    >
                        <i className="bi bi-arrow-clockwise me-1" />
                        Retry
                    </button>
                </div>
            )}

            {/* =====================================================
                FORM
            ====================================================== */}

            <CourierServiceForm
                selectedCourierType={
                    editingCourierService
                        ? editingCourierService.courierType
                        : 2
                }
                onCourierTypeChange={
                    () => {
                        /*
                         * Courier Type inside the form
                         * is managed by CourierServiceForm.
                         *
                         * It should NOT change the table filter.
                         */
                    }
                }
                editingCourierService={
                    editingCourierService
                }
                submitting={submitting}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onCancelEdit={
                    handleCancelEdit
                }
            />

            {/* =====================================================
                TABLE FILTER
            ====================================================== */}

            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body py-3 px-4">
                    <div className="row align-items-center g-3">

                        {/* =================================================
                            FILTER TITLE
                        ================================================== */}

                        <div className="col-lg-3 col-md-4">
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 me-3"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        background:
                                            "#fff0f1",
                                        color:
                                            "#ff2738",
                                    }}
                                >
                                    <i className="bi bi-funnel-fill fs-5" />
                                </div>

                                <div>
                                    <div
                                        className="fw-semibold"
                                        style={{
                                            color:
                                                "#12385c",
                                            fontSize:
                                                "15px",
                                        }}
                                    >
                                        Filter Courier Services
                                    </div>

                                    <small className="text-muted">
                                        View services by type
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            COURIER TYPE
                        ================================================== */}

                        <div className="col-lg-4 col-md-5">
                            <label
                                htmlFor="courierTypeFilter"
                                className="form-label mb-1 fw-semibold text-secondary"
                            >
                                Courier Type
                            </label>

                            <select
                                id="courierTypeFilter"
                                className="form-select"
                                value={
                                    selectedCourierType ===
                                        null
                                        ? ""
                                        : selectedCourierType
                                }
                                onChange={(event) => {
                                    const value =
                                        event.target.value;

                                    handleCourierTypeFilterChange(
                                        value === ""
                                            ? null
                                            : Number(value)
                                    );
                                }}
                                disabled={
                                    loading ||
                                    submitting
                                }
                            >
                                <option value="">
                                    All Courier Types
                                </option>

                                <option value="1">
                                    External Courier
                                </option>

                                <option value="2">
                                    Internal Courier
                                </option>
                            </select>
                        </div>

                        {/* =================================================
                            CURRENT FILTER
                        ================================================== */}

                        <div className="col-lg-5 col-md-3">
                            <div className="d-flex align-items-center justify-content-md-end mt-2 mt-md-4">
                                <span className="text-muted me-2">
                                    Showing:
                                </span>

                                {selectedCourierType ===
                                    null && (
                                        <span className="badge bg-primary-subtle text-primary px-3 py-2">
                                            <i className="bi bi-list-ul me-1" />
                                            All Courier Services
                                        </span>
                                    )}

                                {selectedCourierType ===
                                    1 && (
                                        <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2">
                                            <i className="bi bi-truck me-1" />
                                            External Courier
                                        </span>
                                    )}

                                {selectedCourierType ===
                                    2 && (
                                        <span className="badge bg-info-subtle text-info-emphasis px-3 py-2">
                                            <i className="bi bi-building me-1" />
                                            Internal Courier
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                TABLE
            ====================================================== */}

            <CourierServiceTable
                courierServices={
                    courierServices
                }
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
};

export default CourierServices;