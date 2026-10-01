import type { Customer } from "../types/customerSearch.type";

interface CustomerSearchResultsProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchValue: string;
  loading: boolean;
  onSelectCustomer: (
    customer: Customer,
  ) => void;
  onModifySearch: () => void;
  onContinue: () => void;
}

const CustomerSearchResults = ({
  customers,
  selectedCustomer,
  searchValue,
  loading,
  onSelectCustomer,
  onModifySearch,
  onContinue,
}: CustomerSearchResultsProps) => {
  return (
    <div className="card shadow-sm mt-4">

      {/* ========================================
          STEP 2 HEADER
      ======================================== */}

      <div className="card-header bg-white border-0 pt-4 px-4">

        <div className="d-flex align-items-start">

          <div>
            <h4 className="mb-1">
              Search Results
            </h4>

            <p className="text-muted mb-0">
              Select the required customer from the list.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================
          BODY
      ======================================== */}

      <div className="card-body px-4 pb-4">

        {/* ======================================
            SEARCH CRITERIA
        ====================================== */}

        <div className="card border mb-4">

          <div className="card-header bg-light">
            <h6 className="mb-0">
              Search Criteria
            </h6>
          </div>

          <div className="card-body">

            <div className="row align-items-center">

              <div className="col-md-8">

                <div className="row">

                  <div className="col-md-4 text-muted">
                    Search Value
                  </div>

                  <div className="col-md-8 fw-semibold">
                    {searchValue}
                  </div>

                </div>

              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={onModifySearch}
                  disabled={loading}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Modify Search
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            NO RESULTS
        ====================================== */}

        {!loading && customers.length === 0 && (

          <div className="card border">

            <div className="card-body text-center py-5">

              <i className="bi bi-search fs-1 text-muted"></i>

              <h5 className="mt-3">
                No Customer Found
              </h5>

              <p className="text-muted mb-3">
                No customer matches the entered
                search criteria.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={onModifySearch}
              >
                <i className="bi bi-pencil me-2"></i>
                Modify Search
              </button>

            </div>

          </div>

        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (

          <div className="card border">

            <div className="card-body text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="text-muted mt-3 mb-0">
                Searching customers...
              </p>

            </div>

          </div>

        )}

        {/* ======================================
            RESULTS TABLE
        ====================================== */}

        {!loading && customers.length > 0 && (

          <>

            <div className="card border">

              <div className="card-header bg-light d-flex justify-content-between align-items-center">

                <h6 className="mb-0">
                  Customers
                </h6>

                <span className="badge bg-light text-dark">
                  {customers.length} found
                </span>

              </div>

              <div className="card-body px-0">

                <div className="table-responsive">

                  <table className="table table-hover mb-0">

                    <thead>

                      <tr>

                        <th className="ps-4">
                          Select
                        </th>

                        <th>#</th>

                        <th>Customer Name</th>

                        <th>Mobile Number</th>

                        <th>SAP No.</th>

                        <th>GP No.</th>

                        <th>Address</th>

                      </tr>

                    </thead>

                    <tbody>

                      {customers.map(
                        (customer, index) => (

                          <tr key={customer.id}>

                            <td className="ps-4">

                              <input
                                type="radio"
                                className="form-check-input"
                                name="selectedCustomer"
                                checked={
                                  selectedCustomer?.id ===
                                  customer.id
                                }
                                onChange={() =>
                                  onSelectCustomer(
                                    customer,
                                  )
                                }
                              />

                            </td>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              {customer.customerName}
                            </td>

                            <td>
                              {customer.mobileNumber}
                            </td>

                            <td>
                              {customer.sapNumber}
                            </td>

                            <td>
                              {customer.gpNumber}
                            </td>

                            <td>
                              {customer.address},{" "}
                              {customer.city}
                            </td>

                          </tr>

                        ),
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            {/* CONTINUE */}

            <div className="d-flex justify-content-end mt-3">

              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedCustomer}
                onClick={onContinue}
              >
                Continue
                <i className="bi bi-arrow-right ms-2"></i>
              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default CustomerSearchResults;