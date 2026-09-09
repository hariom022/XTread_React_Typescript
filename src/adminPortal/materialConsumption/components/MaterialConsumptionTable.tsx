import { useEffect, useMemo, useState } from "react";

import type { MaterialConsumption } from "../types/materialConsumption.type";

import MaterialConsumptionModal from "./MaterialConsumptionModal";

interface Props {
  data: MaterialConsumption[];
  loading: boolean;
  error: string;
}

const MaterialConsumptionTable = ({ data, loading, error }: Props) => {
  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pageSize] = useState<number>(10);

  /*
   * ==========================================================
   * SEARCH
   * ==========================================================
   */

  const [searchTerm, setSearchTerm] = useState<string>("");

  /*
   * ==========================================================
   * INSPECT MODAL
   * ==========================================================
   */

  const [selectedMaterialConsumption, setSelectedMaterialConsumption] =
    useState<MaterialConsumption | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  /*
   * ==========================================================
   * OPEN INSPECT MODAL
   * ==========================================================
   */

  const handleInspect = (item: MaterialConsumption) => {
    setSelectedMaterialConsumption(item);
    setShowModal(true);
  };

  /*
   * ==========================================================
   * CLOSE INSPECT MODAL
   * ==========================================================
   */

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaterialConsumption(null);
  };

  /*
   * ==========================================================
   * FILTER DATA
   * ==========================================================
   */

  const filteredMaterialConsumption = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return data;
    }

    return data.filter((item) => {
      const materialText =
        item.materialConsumed
          ?.map(
            (material) =>
              `${material.material}
                 ${material.prodHierarchy4}
                 ${material.quantity}
                 ${material.unitOfMeasure}
                 ${material.casingStageName}`,
          )
          .join(" ") || "";

      return (
        item.orderNumber?.toLowerCase().includes(search) ||
        item.tyreReferenceNumber?.toLowerCase().includes(search) ||
        item.productionNumber?.toLowerCase().includes(search) ||
        item.batchNumber?.toLowerCase().includes(search) ||
        item.barcodeNumber?.toLowerCase().includes(search) ||
        item.customerName?.toLowerCase().includes(search) ||
        materialText.toLowerCase().includes(search)
      );
    });
  }, [data, searchTerm]);

  /*
   * ==========================================================
   * TOTAL PAGES
   * ==========================================================
   */

  const totalPages = Math.ceil(filteredMaterialConsumption.length / pageSize);

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
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  /*
   * ==========================================================
   * CURRENT PAGE DATA
   * ==========================================================
   */

  const paginatedMaterialConsumption = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    return filteredMaterialConsumption.slice(startIndex, endIndex);
  }, [filteredMaterialConsumption, currentPage, pageSize]);

  /*
   * ==========================================================
   * START / END RECORD NUMBER
   * ==========================================================
   */

  const startRecord =
    filteredMaterialConsumption.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endRecord = Math.min(
    currentPage * pageSize,
    filteredMaterialConsumption.length,
  );

  /*
   * ==========================================================
   * PAGE NUMBERS
   * ==========================================================
   */

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  /*
   * ==========================================================
   * GO TO PAGE
   * ==========================================================
   */

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <>
      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {/* =================================================
              HEADER
          ================================================== */}

          <div
            className="
              d-flex
              flex-column
              flex-md-row
              align-items-md-center
              justify-content-between
              gap-3
              p-4
            "
          >
            {/* =================================================
                TITLE
            ================================================== */}

            <div>
              <h2
                className="mb-1"
                style={{
                  color: "#12385c",
                  fontSize: "26px",
                  fontWeight: 600,
                }}
              >
                Material Consumption
              </h2>

              <p
                className="mb-0"
                style={{
                  color: "#53677c",
                  fontSize: "17px",
                }}
              >
                Quality Control Approved Material Consumption
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
                placeholder="Search material consumption..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && !loading && (
            <div className="px-4 pb-3">
              <div className="alert alert-danger mb-0" role="alert">
                <i className="bi bi-exclamation-triangle me-2" />

                {error}
              </div>
            </div>
          )}

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              {/* =================================================
                  TABLE HEADER
              ================================================== */}

              <thead>
                <tr
                  style={{
                    background: "#ff2738",
                  }}
                >
                  {/* # */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    #
                  </th>

                  {/* Order Number */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Order Number
                  </th>

                  {/* Tyre Reference */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tyre Reference
                  </th>

                  {/* Production Number */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Production Number
                  </th>

                  {/* Batch Number */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Batch Number
                  </th>

                  {/* Barcode */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Barcode
                  </th>

                  {/* Customer */}

                  <th
                    className="text-white"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Customer
                  </th>

                  {/* Action */}

                  <th
                    className="text-white text-center"
                    style={{
                      padding: "12px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* =================================================
                  TABLE BODY
              ================================================== */}

              <tbody>
                {/* =================================================
                    LOADING
                ================================================== */}

                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <div className="spinner-border text-danger" />

                      <div className="mt-2 text-muted">
                        Loading material consumption...
                      </div>
                    </td>
                  </tr>
                ) : filteredMaterialConsumption.length === 0 ? (
                  /* =================================================
                     NO DATA
                  ================================================== */

                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <i
                        className="
                          bi
                          bi-inbox
                          d-block
                          text-secondary
                        "
                        style={{
                          fontSize: "32px",
                        }}
                      />

                      <div className="mt-2 text-muted">
                        No material consumption found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* =================================================
                     DATA
                  ================================================== */

                  paginatedMaterialConsumption.map((item, index) => {
                    /*
                     * Global row number
                     */

                    const rowNumber = (currentPage - 1) * pageSize + index + 1;

                    return (
                      <tr key={item.orderCasingId}>
                        {/* =================================================
                              #
                          ================================================== */}

                        <td>{rowNumber}</td>

                        {/* =================================================
                              ORDER NUMBER
                          ================================================== */}

                        <td className="fw-semibold">
                          {item.orderNumber || "-"}
                        </td>

                        {/* =================================================
                              TYRE REFERENCE
                          ================================================== */}

                        <td>{item.tyreReferenceNumber || "-"}</td>

                        {/* =================================================
                              PRODUCTION NUMBER
                          ================================================== */}

                        <td>{item.productionNumber || "-"}</td>

                        {/* =================================================
                              BATCH NUMBER
                          ================================================== */}

                        <td>{item.batchNumber || "-"}</td>

                        {/* =================================================
                              BARCODE
                          ================================================== */}

                        <td>
                          {item.barcodeNumber ? (
                            <span className="badge bg-light text-dark border">
                              {item.barcodeNumber}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* =================================================
                              CUSTOMER
                          ================================================== */}

                        <td className="fw-semibold">
                          {item.customerName || "-"}
                        </td>

                        {/* =================================================
                              ACTION
                          ================================================== */}

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Inspect Material Consumption"
                            onClick={() => handleInspect(item)}
                          >
                            <i className="bi bi-search me-1" />
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          {!loading && filteredMaterialConsumption.length > 0 && (
            <div className="border-top px-4 py-3">
              <div
                className="
                  d-flex
                  flex-column
                  flex-md-row
                  align-items-center
                  justify-content-between
                  gap-3
                "
              >
                {/* =================================================
                    RECORD COUNT
                ================================================== */}

                <div className="text-muted">
                  Showing <strong>{startRecord}</strong> -{" "}
                  <strong>{endRecord}</strong> of{" "}
                  <strong>{filteredMaterialConsumption.length}</strong> material
                  consumption records
                </div>

                {/* =================================================
                    PAGINATION
                ================================================== */}

                {totalPages > 1 && (
                  <nav aria-label="Material consumption pagination">
                    <ul className="pagination mb-0">
                      {/* Previous */}

                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Page Numbers */}

                      {pageNumbers.map((page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* Next */}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          INSPECT MODAL
      ====================================================== */}

      <MaterialConsumptionModal
        materialConsumption={selectedMaterialConsumption}
        show={showModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default MaterialConsumptionTable;
