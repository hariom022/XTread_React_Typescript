import { RingLoader } from "react-spinners";

import AutoclaveTable from "../components/AutoclaveTable";
import useAutoclaves from "../hooks/useAutoclaves";

import "../styles/autoclaves.css";

const AutoclavesPage = () => {
  const {
    paginatedAutoclaves,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useAutoclaves();

  return (
    <div className="autoclave-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="autoclave-page-header">
        <div>
          <h2 className="autoclave-page-title">
            Autoclaves
          </h2>

          <p className="autoclave-page-subtitle">
            Manage and view autoclave master data
          </p>
        </div>
                {/* =========================
            SEARCH
        ========================= */}

        <div className="autoclave-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="autoclave-search-wrapper">
              <span className="autoclave-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="autoclave-search"
                placeholder="Search autoclave..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {/* <div className="autoclave-count">
              {totalItems} Autoclave
              {totalItems !== 1 ? "s" : ""}
            </div> */}

          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="autoclave-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="autoclave-error">
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
            <AutoclaveTable
              autoclaves={paginatedAutoclaves}
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="autoclave-pagination">

                {/* Showing information */}

                <div className="autoclave-pagination-info">
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

                <div className="autoclave-pagination-buttons">

                  {/* Previous */}

                  <button
                    type="button"
                    className="autoclave-page-button"
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
                      className={`autoclave-page-button ${
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
                    className="autoclave-page-button"
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

export default AutoclavesPage;