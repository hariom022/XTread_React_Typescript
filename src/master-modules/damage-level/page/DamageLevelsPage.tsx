import { RingLoader } from "react-spinners";

import DamageLevelTable from "../components/DamageLevelTable";
import useDamageLevels from "../hooks/useDamageLevels";

import "../styles/damageLevels.css";

const DamageLevelsPage = () => {
  const {
    paginatedDamageLevels,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useDamageLevels();

  return (
    <div className="damage-level-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="damage-level-page-header">
        <div>
          <h2 className="damage-level-page-title">
            Damage Levels
          </h2>

          <p className="damage-level-page-subtitle">
            Manage and view damage level master data
          </p>
        </div>
            {/* =========================
            SEARCH
        ========================= */}

        <div className="damage-level-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="damage-level-search-wrapper">
              <span className="damage-level-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="damage-level-search"
                placeholder="Search damage level..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>
{/* 
            <div className="damage-level-count">
              {totalItems} Damage Level
              {totalItems !== 1 ? "s" : ""}
            </div> */}

          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="damage-level-card">
        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="damage-level-error">
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
            <DamageLevelTable
              damageLevels={
                paginatedDamageLevels
              }
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="damage-level-pagination">

                {/* Showing information */}

                <div className="damage-level-pagination-info">
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

                <div className="damage-level-pagination-buttons">

                  {/* Previous */}

                  <button
                    type="button"
                    className="damage-level-page-button"
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
                      className={`damage-level-page-button ${
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
                    className="damage-level-page-button"
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

export default DamageLevelsPage;