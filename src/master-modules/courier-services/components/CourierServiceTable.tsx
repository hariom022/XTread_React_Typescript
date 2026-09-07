import { useEffect, useMemo, useState } from "react";

import type { CourierService } from "../types/courierServices.type";

interface CourierServiceTableProps {
    courierServices: CourierService[];

    searchTerm: string;

    onSearchChange: (
        value: string
    ) => void;

    onEdit: (
        courierService: CourierService
    ) => void;

    onDelete: (
        courierService: CourierService
    ) => Promise<void>;

    loading: boolean;
}

const CourierServiceTable = ({
    courierServices,
    searchTerm,
    onSearchChange,
    onEdit,
    onDelete,
    loading,
}: CourierServiceTableProps) => {

    /*
     * ==========================================================
     * PAGINATION
     * ==========================================================
     */

    const [currentPage, setCurrentPage] =
        useState<number>(1);

    const pageSize = 10;

    /*
     * ==========================================================
     * SEARCH
     * ==========================================================
     */

    const filteredServices = useMemo(() => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();

        if (!search) {
            return courierServices;
        }

        return courierServices.filter(
            (service) =>
                service.courierName
                    .toLowerCase()
                    .includes(search) ||

                (service.code || "")
                    .toLowerCase()
                    .includes(search) ||

                (service.contactPerson || "")
                    .toLowerCase()
                    .includes(search) ||

                (service.contactNumber || "")
                    .toLowerCase()
                    .includes(search) ||

                (service.email || "")
                    .toLowerCase()
                    .includes(search) ||

                (service.address || "")
                    .toLowerCase()
                    .includes(search)
        );

    }, [
        courierServices,
        searchTerm,
    ]);

    /*
     * ==========================================================
     * TOTAL PAGES
     * ==========================================================
     */

    const totalPages = Math.ceil(
        filteredServices.length / pageSize
    );

    /*
     * ==========================================================
     * RESET PAGE WHEN SEARCH CHANGES
     * ==========================================================
     */

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    /*
     * ==========================================================
     * KEEP PAGE VALID
     * ==========================================================
     */

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0) {
            setCurrentPage(1);
        }

    }, [
        currentPage,
        totalPages,
    ]);

    /*
     * ==========================================================
     * PAGINATED DATA
     * ==========================================================
     */

    const paginatedServices =
        useMemo(() => {

            const startIndex =
                (currentPage - 1) *
                pageSize;

            return filteredServices.slice(
                startIndex,
                startIndex + pageSize
            );

        }, [
            filteredServices,
            currentPage,
        ]);

    /*
     * ==========================================================
     * RECORD NUMBERS
     * ==========================================================
     */

    const startRecord =
        filteredServices.length === 0
            ? 0
            : (currentPage - 1) *
            pageSize +
            1;

    const endRecord =
        Math.min(
            currentPage * pageSize,
            filteredServices.length
        );

    /*
     * ==========================================================
     * PAGINATION PAGE NUMBERS
     *
     * Shows:
     *
     * 1 2 3 ... 10
     *
     * instead of displaying too many buttons.
     * ==========================================================
     */

    const pageNumbers = useMemo(() => {

        if (totalPages <= 5) {
            return Array.from(
                {
                    length: totalPages,
                },
                (_, index) => index + 1
            );
        }

        const pages: (
            number | "..."
        )[] = [];

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const startPage =
            Math.max(
                2,
                currentPage - 1
            );

        const endPage =
            Math.min(
                totalPages - 1,
                currentPage + 1
            );

        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {
            pages.push(page);
        }

        if (
            currentPage <
            totalPages - 2
        ) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;

    }, [
        currentPage,
        totalPages,
    ]);

    /*
     * ==========================================================
     * DELETE
     * ==========================================================
     */

    const handleDelete = async (
        service: CourierService
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete courier service "${service.courierName}"?`
            );

        if (!confirmed) {
            return;
        }

        await onDelete(service);
    };

    /*
     * ==========================================================
     * RENDER
     * ==========================================================
     */

    return (
        <div className="card border-0 shadow-sm overflow-hidden">

            {/* ==================================================
                HEADER
            =================================================== */}

            <div className="card-body px-4 py-4">

                <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">

                    {/* Title */}

                    <div>

                        <div className="d-flex align-items-center gap-2 mb-1">

                            <div className="text-danger fs-4">
                                <i className="bi bi-truck" />
                            </div>

                            <h4 className="mb-0 fw-semibold text-dark">
                                Courier Services
                            </h4>

                        </div>

                        <p className="mb-0 text-secondary small">
                            Manage and view registered courier services
                        </p>

                    </div>

                    {/* Search */}

                    <div className="input-group">

                        <span className="input-group-text bg-white text-secondary">
                            <i className="bi bi-search" />
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search courier services..."
                            value={searchTerm}
                            onChange={(event) =>
                                onSearchChange(
                                    event.target.value
                                )
                            }
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    onSearchChange("")
                                }
                                title="Clear search"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        )}

                    </div>

                </div>

            </div>

            {/* ==================================================
                TABLE
            =================================================== */}

            <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                    <thead>

                        <tr className="bg-danger">

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                #
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Courier Name
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Courier Type
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Code
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Contact Person
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Contact Number
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Email
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap"
                            >
                                Address
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap text-center"
                            >
                                Status
                            </th>

                            <th
                                className="text-white fw-semibold small text-nowrap text-center"
                            >
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {/* ==================================================
                            LOADING
                        =================================================== */}

                        {loading ? (

                            <tr>

                                <td
                                    colSpan={10}
                                    className="text-center py-5"
                                >

                                    <div
                                        className="spinner-border text-danger"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>

                                    <div className="mt-3 text-secondary small">
                                        Loading courier services...
                                    </div>

                                </td>

                            </tr>

                        ) : filteredServices.length === 0 ? (

                            /* ==================================================
                               EMPTY
                            =================================================== */

                            <tr>

                                <td
                                    colSpan={10}
                                    className="text-center py-5"
                                >

                                    <div className="text-secondary fs-1">
                                        <i className="bi bi-inbox" />
                                    </div>

                                    <div className="mt-2 fw-semibold text-secondary">
                                        No courier services found
                                    </div>

                                    <div className="small text-muted mt-1">
                                        Try changing your search or filter.
                                    </div>

                                </td>

                            </tr>

                        ) : (

                            /* ==================================================
                               DATA
                            =================================================== */

                            paginatedServices.map(
                                (
                                    service,
                                    index
                                ) => {

                                    const rowNumber =
                                        (currentPage - 1) *
                                        pageSize +
                                        index +
                                        1;

                                    return (

                                        <tr
                                            key={
                                                service.courierServiceId
                                            }
                                        >

                                            {/* # */}

                                            <td className="text-secondary small">
                                                {rowNumber}
                                            </td>

                                            {/* Courier Name */}

                                            <td>

                                                <div className="fw-semibold text-dark">
                                                    {
                                                        service.courierName
                                                    }
                                                </div>

                                            </td>

                                            {/* Courier Type */}

                                            <td>

                                                {service.courierType === 1 ? (

                                                    <span className="badge rounded-pill bg-primary-subtle text-primary fw-medium">
                                                        <i className="bi bi-truck me-1" />
                                                        External
                                                    </span>

                                                ) : (

                                                    <span className="badge rounded-pill bg-info-subtle text-info-emphasis fw-medium">
                                                        <i className="bi bi-building me-1" />
                                                        Internal
                                                    </span>

                                                )}

                                            </td>

                                            {/* Code */}

                                            <td>

                                                {service.code ? (

                                                    <span className="badge bg-light text-dark border fw-medium">
                                                        {
                                                            service.code
                                                        }
                                                    </span>

                                                ) : (

                                                    <span className="text-muted">
                                                        -
                                                    </span>

                                                )}

                                            </td>

                                            {/* Contact Person */}

                                            <td className="text-secondary small">
                                                {
                                                    service.contactPerson ||
                                                    "-"
                                                }
                                            </td>

                                            {/* Contact Number */}

                                            <td className="text-secondary small text-nowrap">
                                                {
                                                    service.contactNumber ||
                                                    "-"
                                                }
                                            </td>

                                            {/* Email */}

                                            <td className="text-secondary small">
                                                {
                                                    service.email ||
                                                    "-"
                                                }
                                            </td>

                                            {/* Address */}

                                            <td className="text-secondary small">
                                                {
                                                    service.address ||
                                                    "-"
                                                }
                                            </td>

                                            {/* Status */}

                                            <td className="text-center">

                                                {service.isActive ? (

                                                    <span className="badge rounded-pill bg-success-subtle text-success fw-medium">
                                                        <i className="bi bi-check-circle me-1" />
                                                        Active
                                                    </span>

                                                ) : (

                                                    <span className="badge rounded-pill bg-secondary-subtle text-secondary fw-medium">
                                                        <i className="bi bi-dash-circle me-1" />
                                                        Inactive
                                                    </span>

                                                )}

                                            </td>

                                            {/* Actions */}

                                            <td>

                                                <div className="d-flex justify-content-center gap-2">

                                                    {/* Edit */}

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit Courier Service"
                                                        onClick={() =>
                                                            onEdit(
                                                                service
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil" />
                                                    </button>

                                                    {/* Delete */}

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete Courier Service"
                                                        onClick={() =>
                                                            handleDelete(
                                                                service
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash3" />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );
                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>

            {/* ==================================================
                FOOTER / PAGINATION
            =================================================== */}

            {!loading &&
                filteredServices.length > 0 && (

                    <div className="card-body border-top px-4 py-3">

                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">

                            {/* Record Count */}

                            <div className="text-secondary small">

                                Showing{" "}

                                <span className="fw-semibold text-dark">
                                    {startRecord}
                                </span>

                                {" "} - {" "}

                                <span className="fw-semibold text-dark">
                                    {endRecord}
                                </span>

                                {" "}of{" "}

                                <span className="fw-semibold text-dark">
                                    {
                                        filteredServices.length
                                    }
                                </span>

                                {" "}courier services

                            </div>

                            {/* Pagination */}

                            {totalPages > 1 && (

                                <nav
                                    aria-label="Courier service pagination"
                                >

                                    <ul className="pagination pagination-sm mb-0">

                                        {/* Previous */}

                                        <li
                                            className={`page-item ${currentPage === 1
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                        >

                                            <button
                                                type="button"
                                                className="page-link"
                                                disabled={
                                                    currentPage ===
                                                    1
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (
                                                            page
                                                        ) =>
                                                            page -
                                                            1
                                                    )
                                                }
                                            >
                                                <i className="bi bi-chevron-left me-1" />
                                                Previous
                                            </button>

                                        </li>

                                        {/* Page Numbers */}

                                        {pageNumbers.map(
                                            (
                                                page,
                                                index
                                            ) => {

                                                if (
                                                    page ===
                                                    "..."
                                                ) {

                                                    return (

                                                        <li
                                                            key={`ellipsis-${index}`}
                                                            className="page-item disabled"
                                                        >

                                                            <span className="page-link">
                                                                ...
                                                            </span>

                                                        </li>

                                                    );

                                                }

                                                return (

                                                    <li
                                                        key={page}
                                                        className={`page-item ${currentPage ===
                                                                page
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                    >

                                                        <button
                                                            type="button"
                                                            className="page-link"
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    page
                                                                )
                                                            }
                                                        >
                                                            {page}
                                                        </button>

                                                    </li>

                                                );

                                            }
                                        )}

                                        {/* Next */}

                                        <li
                                            className={`page-item ${currentPage ===
                                                    totalPages
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                        >

                                            <button
                                                type="button"
                                                className="page-link"
                                                disabled={
                                                    currentPage ===
                                                    totalPages
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (
                                                            page
                                                        ) =>
                                                            page +
                                                            1
                                                    )
                                                }
                                            >
                                                Next
                                                <i className="bi bi-chevron-right ms-1" />
                                            </button>

                                        </li>

                                    </ul>

                                </nav>

                            )}

                        </div>

                    </div>

                )}

        </div>
    );
};

export default CourierServiceTable;