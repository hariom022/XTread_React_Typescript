import { RingLoader } from "react-spinners";

import MachineTable from "../components/MachineTable";
import useMachines from "../hooks/useMachines";

import "../styles/machines.css";

const MachinesPage = () => {
  const {
    paginatedMachines,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    handlePageChange,
  } = useMachines();

  return (
    <div className="machine-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="machine-page-header">
        <div>
          <h2 className="machine-page-title">
            Machines
          </h2>

          <p className="machine-page-subtitle">
            Manage and view machine master data
          </p>
        </div>
         {/* =========================
            SEARCH
        ========================= */}

        <div className="machine-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="machine-search-wrapper">
              <span className="machine-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="machine-search"
                placeholder="Search machine..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {/* <div className="machine-count">
              {totalItems} Machine
              {totalItems !== 1 ? "s" : ""}
            </div> */}

          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="machine-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="machine-error">
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
            <MachineTable
              machines={paginatedMachines}
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 0 && (
              <div className="machine-pagination">

                {/* Showing information */}

                <div className="machine-pagination-info">
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

                <div className="machine-pagination-buttons">

                  {/* Previous */}

                  <button
                    type="button"
                    className="machine-page-button"
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
                      className={`machine-page-button ${
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
                    className="machine-page-button"
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

export default MachinesPage;