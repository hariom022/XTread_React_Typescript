
import useCustomers from "../hooks/useCustomers";
import CustomerTable from "../components/CustomerTable";
import "../styles/customers.css";

const CustomerPage = () => {
  const {
    customers,
    regions,

    selectedRegionId,
    handleRegionChange,

    searchTerm,
    setSearchTerm,

    selectedCustomers,
    handleSelectCustomer,
    handleSelectAll,
    isAllSelected,

    pageNumber,
    setPageNumber,

    pageSize,
    handlePageSizeChange,

    totalRecords,
    totalPages,

    loading,
    error,
  } = useCustomers();

  return (
    <div className="container-fluid customer-page">

      {/* Page Header */}
      <div className="customer-header">
        <div>
          <h4>Customer Master</h4>
          <p className="text-muted mb-0 mt-1">
            Manage and view customer information
          </p>
        </div>

        <span className="selected-count">
          Selected: {selectedCustomers.length}
        </span>
      </div>

      {/* Filters Section */}
      <div className="customer-filters">
        <div className="row g-3 align-items-end">

          {/* Region Filter */}
          <div className="col-md-3">
            <label className="form-label">
              Region
            </label>

            <select
              className="form-select"
              value={selectedRegionId}
              onChange={(e) =>
                handleRegionChange(Number(e.target.value))
              }
            >
              <option value={0}>All Regions</option>

              {regions.map((region) => (
                <option
                  key={region.id}
                  value={region.id}
                >
                  {region.regionName}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Search */}
          <div className="col-md-4">
            <label className="form-label">
              Search Customer
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search by customer number, name"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {/* Page Size */}
          <div className="col-md-2">
            <label className="form-label">
              Records Per Page
            </label>

            <select
              className="form-select"
              value={pageSize}
              onChange={(e) =>
                handlePageSizeChange(Number(e.target.value))
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Clear Filters
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                handleRegionChange(0);
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          </div> */}

        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Customer Table */}
      <div className="customer-table-wrapper">
        <CustomerTable
          customers={customers}
          selectedCustomers={selectedCustomers}
          isAllSelected={isAllSelected}
          onSelectCustomer={handleSelectCustomer}
          onSelectAll={handleSelectAll}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <div className="customer-pagination">

        {/* Total Records */}
        <div>
          Total Customers:{" "}
          <strong>{totalRecords}</strong>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-actions">

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            disabled={pageNumber <= 1 || loading}
            onClick={() =>
              setPageNumber((previous) => previous - 1)
            }
          >
            Previous
          </button>

          <span>
            Page <strong>{pageNumber}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            disabled={
              pageNumber >= totalPages ||
              totalPages === 0 ||
              loading
            }
            onClick={() =>
              setPageNumber((previous) => previous + 1)
            }
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
};

export default CustomerPage;
