import CategoryTable from "../components/CategoryTable";
import useCategories from "../hooks/useCategories";
import { RingLoader } from "react-spinners";
import "../styles/categories.css";

const CategoriesPage = () => {
  const {
    filteredCategories,

    loading,
    error,

    search,
    handleSearch,
  } = useCategories();

  return (
    <div className="category-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="category-page-header">

        <div>
          <h2 className="category-page-title">
            Categories
          </h2>

          <p className="category-page-subtitle">
            Manage and view category master data
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="category-filter-section">

          <div className="d-flex align-items-center justify-content-between">

            <div className="category-search-wrapper">

              <span className="category-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="category-search"
                placeholder="Search category..."
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

      <div className="category-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="category-error">
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
          <CategoryTable
            categories={filteredCategories}
            loading={loading}
          />
        )}

      </div>

    </div>
  );
};

export default CategoriesPage;