import { RingLoader } from "react-spinners";

import RejectionReasonTable from "../components/RejectionReasonTable";
import useRejectionReasons from "../hooks/useRejectionReasons";

import "../styles/rejectionReasons.css";

const RejectionReasonsPage = () => {
  const {
    paginatedRejectionReasons,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useRejectionReasons();

  return (
    <div className="rejection-reason-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="rejection-reason-page-header">
        <div>
          <h2 className="rejection-reason-page-title">
            Rejection Reasons
          </h2>

          <p className="rejection-reason-page-subtitle">
            Manage and view rejection reason master data
          </p>
        </div>
        {/* =========================
            SEARCH
        ========================= */}

        <div className="rejection-reason-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="rejection-reason-search-wrapper">
              <span className="rejection-reason-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="rejection-reason-search"
                placeholder="Search rejection reason..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {/* <div className="rejection-reason-count">
              {totalItems} Rejection Reason
              {totalItems !== 1 ? "s" : ""}
            </div> */}

          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="rejection-reason-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="rejection-reason-error">
            {error}
          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <RingLoader
            color="#b30815"
            size={80}
          />
        </div>
        ) : (
          <>
            <RejectionReasonTable
              rejectionReasons={
                paginatedRejectionReasons
              }
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="rejection-reason-pagination">

                {/* Showing information */}

                <div className="rejection-reason-pagination-info">
                  Showing{" "}
                  <strong>
                    {(currentPage - 1) *
                      itemsPerPage +
                      1}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {Math.min(
                      currentPage *
                        itemsPerPage,
                      totalItems
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {totalItems}
                  </strong>{" "}
                  records
                </div>

                {/* Pagination buttons */}

                <div className="rejection-reason-pagination-buttons">

                  {/* Previous */}

                  <button
                    type="button"
                    className="rejection-reason-page-button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1
                      )
                    }
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`rejection-reason-page-button ${
                        currentPage === page
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handlePageChange(page)
                      }
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}

                  <button
                    type="button"
                    className="rejection-reason-page-button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
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

export default RejectionReasonsPage;