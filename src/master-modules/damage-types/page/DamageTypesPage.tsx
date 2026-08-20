import { RingLoader } from "react-spinners";

import DamageTypeTable from "../components/DamageTypeTable";
import useDamageTypes from "../hooks/useDamagetypes";

import "../styles/damageTypes.css";

const DamageTypesPage = () => {
  const {
    paginatedDamageTypes,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useDamageTypes();

  return (
    <div className="damage-type-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="damage-type-page-header">
        <div>
          <h2 className="damage-type-page-title">
            Damage Types
          </h2>

          <p className="damage-type-page-subtitle">
            Manage and view damage type master data
          </p>
        </div>
         {/* =========================
            SEARCH
        ========================= */}

        <div className="damage-type-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="damage-type-search-wrapper">
              <span className="damage-type-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="damage-type-search"
                placeholder="Search damage type..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {/* <div className="damage-type-count">
              {totalItems} Damage Type
              {totalItems !== 1 ? "s" : ""}
            </div> */}

          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="damage-type-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="damage-type-error">
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
            <DamageTypeTable
              damageTypes={paginatedDamageTypes}
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="damage-type-pagination">

                {/* Showing information */}

                <div className="damage-type-pagination-info">
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

                <div className="damage-type-pagination-buttons">

                  {/* Previous */}

                  <button
                    type="button"
                    className="damage-type-page-button"
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
                      className={`damage-type-page-button ${
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
                    className="damage-type-page-button"
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

export default DamageTypesPage;