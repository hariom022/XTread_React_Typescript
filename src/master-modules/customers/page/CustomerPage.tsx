import CustomerTable from "../components/CustomerTable";
import useCustomers from "../hooks/useCustomers";
import { RingLoader } from "react-spinners";
import "../styles/customers.css";

const CustomersPage = () => {
  const {
    filteredCustomers,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    selectedCustomerRows,

    toggleCustomerRow,
    toggleAllCustomers,

    loadCustomers,
  } = useCustomers();

  return (
    <div className="customer-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="customer-page-header">
        <div>
          <h2 className="customer-page-title">Customer Master</h2>

          <p className="customer-page-subtitle">
            Manage and view customer master data
          </p>
        </div>
        {/* =========================
            SEARCH SECTION
        ========================= */}
        <div className="customer-filter-section">
          <div className="d-flex align-items-center justify-content-between">
            {/* Search */}
            <div className="customer-search-wrapper">
              <span className="customer-search-icon">🔍</span>

              <input
                type="text"
                className="customer-search"
                placeholder="Search customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Count
            <div className="customer-count">
              {filteredCustomers.length} Customer
              {filteredCustomers.length !== 1
                ? "s"
                : ""}
            </div> */}
          </div>
        </div>
        {/* <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={loadCustomers}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />

              Refreshing...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </>
          )}
        </button> */}
      </div>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="customer-card">
        {/* =========================
            ERROR
        ========================= */}

        {error && <div className="customer-error">{error}</div>}

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
          <CustomerTable
            customers={filteredCustomers}
            selectedCustomerRows={selectedCustomerRows}
            toggleCustomerRow={toggleCustomerRow}
            toggleAllCustomers={toggleAllCustomers}
          />
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
