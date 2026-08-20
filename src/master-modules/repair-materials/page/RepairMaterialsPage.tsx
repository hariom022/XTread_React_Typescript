import { RingLoader } from "react-spinners";

import RepairMaterialTable from "../components/RepairMaterialTable";
import useRepairMaterials from "../hooks/useRepairMaterials";

import "../styles/repairMaterials.css";

const RepairMaterialsPage = () => {
  const {
    paginatedRepairMaterials,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useRepairMaterials();

  return (
    <div className="repair-material-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="repair-material-page-header">
        <div>
          <h2 className="repair-material-page-title">Repair Materials</h2>

          <p className="repair-material-page-subtitle">
            Manage and view repair material master data
          </p>
        </div>
         {/* =========================
            SEARCH
        ========================= */}

        <div className="repair-material-filter-section">
          <div className="d-flex align-items-center justify-content-between">
            <div className="repair-material-search-wrapper">
              <span className="repair-material-search-icon">🔍</span>

              <input
                type="text"
                className="repair-material-search"
                placeholder="Search repair material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* <div className="repair-material-count">
              {totalItems} Repair Material
              {totalItems !== 1 ? "s" : ""}
            </div> */}
          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="repair-material-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && <div className="repair-material-error">{error}</div>}

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <RingLoader color="#b30815" size={80} />
          </div>
        ) : (
          <>
            <RepairMaterialTable repairMaterials={paginatedRepairMaterials} />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="repair-material-pagination">
                {/* Showing information */}

                <div className="repair-material-pagination-info">
                  Showing{" "}
                  <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
                  <strong>
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </strong>{" "}
                  of <strong>{totalItems}</strong> records
                </div>

                {/* Pagination buttons */}

                <div className="repair-material-pagination-buttons">
                  {/* Previous */}

                  <button
                    type="button"
                    className="repair-material-page-button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`repair-material-page-button ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}

                  <button
                    type="button"
                    className="repair-material-page-button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RepairMaterialsPage;
