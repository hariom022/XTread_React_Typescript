import { useEffect, useMemo, useState } from "react";

import type {
  CourierService,
  Driver,
} from "../types/drivers.type";

interface DriverTableProps {
  drivers: Driver[];

  courierServices: CourierService[];

  searchTerm: string;

  onSearchChange: (value: string) => void;

  onEdit: (driver: Driver) => void;

  onDelete: (driver: Driver) => Promise<void>;

  loading: boolean;
}

const DriverTable = ({
  drivers,
  courierServices,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  loading,
}: DriverTableProps) => {
  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const [pageSize] =
    useState<number>(10);

  /*
   * ==========================================================
   * SEARCH + FILTER
   * ==========================================================
   */

  const filteredDrivers = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return drivers;
    }

    return drivers.filter((driver) => {
      const courierServiceName =
        courierServices.find(
          (service) =>
            service.courierServiceId ===
            driver.courierServiceId
        )?.courierName || "";

      return (
        driver.driverName
          .toLowerCase()
          .includes(search) ||
        driver.driverIdNo
          .toLowerCase()
          .includes(search) ||
        (
          driver.contactNumber || ""
        )
          .toLowerCase()
          .includes(search) ||
        courierServiceName
          .toLowerCase()
          .includes(search)
      );
    });
  }, [
    drivers,
    searchTerm,
    courierServices,
  ]);

  /*
   * ==========================================================
   * TOTAL PAGES
   * ==========================================================
   */

  const totalPages = Math.ceil(
    filteredDrivers.length / pageSize
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
   * MAKE SURE CURRENT PAGE IS VALID
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
    totalPages,
    currentPage,
  ]);

  /*
   * ==========================================================
   * CURRENT PAGE DATA
   * ==========================================================
   */

  const paginatedDrivers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex =
      startIndex + pageSize;

    return filteredDrivers.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredDrivers,
    currentPage,
    pageSize,
  ]);

  /*
   * ==========================================================
   * START / END RECORD NUMBER
   * ==========================================================
   */

  const startRecord =
    filteredDrivers.length === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const endRecord = Math.min(
    currentPage * pageSize,
    filteredDrivers.length
  );

  /*
   * ==========================================================
   * PAGE NUMBERS
   * ==========================================================
   */

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  /*
   * ==========================================================
   * GO TO PAGE
   * ==========================================================
   */

  const goToPage = (
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

  /*
   * ==========================================================
   * DELETE
   * ==========================================================
   */

  const handleDelete = async (
    driver: Driver
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete driver "${driver.driverName}"?`
      );

    if (!confirmed) {
      return;
    }

    await onDelete(driver);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4">
          <div>
            <h2
              className="mb-1"
              style={{
                color: "#12385c",
                fontSize: "26px",
                fontWeight: 600,
              }}
            >
              Drivers
            </h2>

            <p
              className="mb-0"
              style={{
                color: "#53677c",
                fontSize: "17px",
              }}
            >
              Manage and view registered drivers
            </p>
          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <div
            className="input-group"
            style={{
              width: "360px",
              maxWidth: "100%",
            }}
          >
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-primary" />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr
                style={{
                  background: "#ff2738",
                }}
              >
                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  #
                </th>

                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  Courier Service
                </th>

                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  Driver Name
                </th>

                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  Driver ID No
                </th>

                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  Contact Number
                </th>

                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  Status
                </th>

                <th
                  className="text-white"
                  style={{
                    padding: "12px 10px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {/* =================================================
                  LOADING
              ================================================== */}

              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-5"
                  >
                    <div className="spinner-border text-danger" />

                    <div className="mt-2 text-muted">
                      Loading drivers...
                    </div>
                  </td>
                </tr>
              ) : filteredDrivers.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-5"
                  >
                    <i
                      className="bi bi-inbox d-block text-secondary"
                      style={{
                        fontSize: "32px",
                      }}
                    />

                    <div className="mt-2 text-muted">
                      No drivers found.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDrivers.map(
                  (driver, index) => {
                    /*
                     * Global row number
                     */

                    const rowNumber =
                      (currentPage - 1) *
                        pageSize +
                      index +
                      1;

                    /*
                     * Courier service name
                     */

                    const courierService =
                      courierServices.find(
                        (service) =>
                          service.courierServiceId ===
                          driver.courierServiceId
                      );

                    return (
                      <tr
                        key={
                          driver.driverId
                        }
                      >
                        {/* # */}

                        <td>
                          {rowNumber}
                        </td>

                        {/* Courier Service */}

                        <td>
                          <span className="badge bg-light text-primary border">
                            {courierService
                              ?.courierName ||
                              `Service #${driver.courierServiceId}`}
                          </span>
                        </td>

                        {/* Driver Name */}

                        <td className="fw-semibold">
                          {
                            driver.driverName
                          }
                        </td>

                        {/* Driver ID */}

                        <td>
                          {
                            driver.driverIdNo
                          }
                        </td>

                        {/* Contact */}

                        <td>
                          {driver.contactNumber ||
                            "-"}
                        </td>

                        {/* Status */}

                        <td>
                          {driver.isActive ? (
                            <span className="badge bg-success-subtle text-success">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary">
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}

                        <td>
                          <div className="d-flex gap-2">
                            {/* Edit */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Edit Driver"
                              onClick={() =>
                                onEdit(
                                  driver
                                )
                              }
                            >
                              <i className="bi bi-pencil" />
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Driver"
                              onClick={() =>
                                handleDelete(
                                  driver
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

        {/* =====================================================
            FOOTER
        ====================================================== */}

        {!loading &&
          filteredDrivers.length >
            0 && (
            <div className="border-top px-4 py-3">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                {/* =================================================
                    RECORD COUNT
                ================================================== */}

                <div className="text-muted">
                  Showing{" "}
                  <strong>
                    {startRecord}
                  </strong>{" "}
                  -{" "}
                  <strong>
                    {endRecord}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {
                      filteredDrivers.length
                    }
                  </strong>{" "}
                  drivers
                </div>

                {/* =================================================
                    PAGINATION
                ================================================== */}

                <nav
                  aria-label="Driver pagination"
                >
                  <ul className="pagination mb-0">
                    {/* Previous */}

                    <li
                      className={`page-item ${
                        currentPage === 1
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() =>
                          goToPage(
                            currentPage -
                              1
                          )
                        }
                        disabled={
                          currentPage ===
                          1
                        }
                      >
                        Previous
                      </button>
                    </li>

                    {/* Page Numbers */}

                    {pageNumbers.map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage ===
                            page
                              ? "active"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="page-link"
                            onClick={() =>
                              goToPage(
                                page
                              )
                            }
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    {/* Next */}

                    <li
                      className={`page-item ${
                        currentPage ===
                        totalPages
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() =>
                          goToPage(
                            currentPage +
                              1
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default DriverTable;