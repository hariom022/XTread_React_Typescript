import ZoneTable from "../components/ZoneTable";
import useZones from "../hooks/useZones";
import { RingLoader } from "react-spinners";
import "../styles/zones.css";

const ZonesPage = () => {
  const {
    filteredZones,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useZones();

  return (
    <div className="zone-page">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="zone-page-header">
        <div>
          <h2 className="zone-page-title">Zones</h2>
          <p className="zone-page-subtitle">
            Manage and view zone master data
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================= */}
        <div className="zone-filter-section">
          <div className="d-flex align-items-center justify-content-between">
            <div className="zone-search-wrapper">
              <span className="zone-search-icon">🔍</span>
              <input
                type="text"
                className="zone-search"
                placeholder="Search zone or region..."
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
      <div className="zone-card">
        {/* =========================
            ERROR
        ========================= */}
        {error && <div className="zone-error">{error}</div>}

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
          <ZoneTable zones={filteredZones} />
        )}
      </div>
    </div>
  );
};

export default ZonesPage;