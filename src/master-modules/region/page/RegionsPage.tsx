import RegionTable from "../components/RegionTable";
import useRegions from "../hooks/useRegions";
import { RingLoader } from "react-spinners";
import "../styles/regions.css";

const RegionsPage = () => {
  const {
    filteredRegions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useRegions();

  return (
    <div className="region-page">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="region-page-header">
        <div>
          <h2 className="region-page-title">Regions</h2>
          <p className="region-page-subtitle">
            Manage and view region master data
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================= */}
        <div className="region-filter-section">
          <div className="d-flex align-items-center justify-content-between">
            <div className="region-search-wrapper">
              <span className="region-search-icon">🔍</span>
              <input
                type="text"
                className="region-search"
                placeholder="Search region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}
      <div className="region-card">
        {/* =========================
            ERROR
        ========================= */}
        {error && <div className="region-error">{error}</div>}

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
          <RegionTable regions={filteredRegions} />
        )}
      </div>
    </div>
  );
};

export default RegionsPage;