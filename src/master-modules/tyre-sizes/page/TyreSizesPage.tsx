import TyreSizeTable from "../components/TyreSizeTable";
import useTyreSizes from "../hooks/useTyreSizes";
import "../styles/tyreSizes.css";
import { RingLoader } from "react-spinners";

const TyreSizesPage = () => {
  const {
    filteredTyreSizes,
    paginatedTyreSizes,

    loading,
    error,

    search,
    handleSearch,

    currentPage,
    totalPages,
    handlePageChange,
  } = useTyreSizes();

  return (
    <div className="tyre-size-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="tyre-size-page-header">
        <div>
          <h2 className="tyre-size-page-title">
            Tyre Sizes
          </h2>

          <p className="tyre-size-page-subtitle">
            Manage and view tyre size master data
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="tyre-size-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="tyre-size-search-wrapper">
              <span className="tyre-size-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="tyre-size-search"
                placeholder="Search tyre size..."
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
              />
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="tyre-size-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="tyre-size-error">
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
            {/* =========================
                TABLE
            ========================= */}

            <TyreSizeTable
              tyreSizes={paginatedTyreSizes}
              loading={loading}
            />

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 1 && (
              <div className="tyre-size-pagination">

                {/* LEFT SIDE */}
                <div className="tyre-size-pagination-info">
                  Showing{" "}
                  {(currentPage - 1) * 10 + 1}
                  {" - "}
                  {Math.min(
                    currentPage * 10,
                    filteredTyreSizes.length
                  )}{" "}
                  of {filteredTyreSizes.length}
                </div>

                {/* RIGHT SIDE */}
                <div className="tyre-size-pagination-buttons">

                  {/* PREVIOUS */}
                  <button
                    type="button"
                    className="tyre-size-pagination-button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                  >
                    Previous
                  </button>

                  {/* PAGE NUMBERS */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`tyre-size-pagination-button ${
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

                  {/* NEXT */}
                  <button
                    type="button"
                    className="tyre-size-pagination-button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      handlePageChange(currentPage + 1)
                    }
                  >
                    Next
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

export default TyreSizesPage;