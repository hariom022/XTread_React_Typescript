import { RingLoader } from "react-spinners";

import TyreMakeTable from "../components/TyreMakeTable";
import useTyreMakes from "../hooks/useTyreMakes";

import "../styles/tyreMakes.css";

const TyreMakesPage = () => {
  const {
    paginatedTyreMakes,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useTyreMakes();

  return (
    <div className="tyre-make-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="tyre-make-page-header">
        <div>
          <h2 className="tyre-make-page-title">
            Tyre Makes
          </h2>

          <p className="tyre-make-page-subtitle">
            Manage and view tyre make master data
          </p>
        </div>
        
        {/* =========================
            SEARCH
        ========================= */}

        <div className="tyre-make-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="tyre-make-search-wrapper">
              <span className="tyre-make-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="tyre-make-search"
                placeholder="Search tyre make..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {/* <div className="tyre-make-count">
              {totalItems} Tyre Make
              {totalItems !== 1 ? "s" : ""}
            </div> */}
          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="tyre-make-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="tyre-make-error">
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
            <TyreMakeTable
              tyreMakes={paginatedTyreMakes}
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="tyre-make-pagination">

                {/* Showing information */}

                <div className="tyre-make-pagination-info">
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
                  <strong>{totalItems}</strong>{" "}
                  records
                </div>

                {/* Pagination buttons */}

                <div className="tyre-make-pagination-buttons">

                  {/* Previous */}

                  <button
                    type="button"
                    className="tyre-make-page-button"
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
                      className={`tyre-make-page-button ${
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
                    className="tyre-make-page-button"
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

export default TyreMakesPage;