import ServiceTypeTable from "../components/ServiceTypeTable";
import useServiceTypes from "../hooks/useServiceTypes";
import { RingLoader } from "react-spinners";
import "../styles/serviceTypes.css";

const ServiceTypesPage = () => {
  const {
    filteredServiceTypes,

    loading,
    error,

    searchTerm,
    setSearchTerm,
  } = useServiceTypes();

  return (
    <div className="service-type-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="service-type-page-header">
        <div>
          <h2 className="service-type-page-title">
            Service Types
          </h2>

          <p className="service-type-page-subtitle">
            Manage and view service type master data
          </p>
        </div>
           {/* =========================
            SEARCH
        ========================= */}

        <div className="service-type-filter-section">
          <div className="d-flex align-items-center justify-content-between">

            <div className="service-type-search-wrapper">
              <span className="service-type-search-icon">
                🔍
              </span>

              <input
                type="text"
                className="service-type-search"
                placeholder="Search service type..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {/* <div className="service-type-count">
              {filteredServiceTypes.length} Service Type
              {filteredServiceTypes.length !== 1
                ? "s"
                : ""}
            </div> */}
          </div>
        </div>
      </div>
      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="service-type-card">

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="service-type-error">
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
          <ServiceTypeTable
            serviceTypes={filteredServiceTypes}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceTypesPage;