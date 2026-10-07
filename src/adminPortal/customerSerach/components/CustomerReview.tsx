import type { Customer } from "../types/customerSearch.type";

interface CustomerReviewProps {
  show: boolean;
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onSave: () => void;
}

const CustomerReview = ({
  show,
  customer,
  loading,
  error,
  onBack,
  onSave,
}: CustomerReviewProps) => {
  if (!show || !customer) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            {/* HEADER */}

            <div className="modal-header">
              <div>
                <h5 className="modal-title">Review & Confirm</h5>

                <small className="text-muted">
                  Verify the selected customer details before saving.
                </small>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onBack}
                disabled={loading}
              />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="card border">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Selected Customer Details</h6>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <tbody>
                      <tr>
                        <th className="bg-light w-25">Customer Number</th>
                        <td>{customer.customerNumber}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Customer Name</th>
                        <td>{customer.customerName}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Mobile Number</th>
                        <td>{customer.mobileNumber || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Email</th>
                        <td>{customer.email || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Company Code</th>
                        <td>{customer.companyCode || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Sales Group</th>
                        <td>
                          {customer.salesGroupDescription
                            ? `${customer.salesGroup} - ${customer.salesGroupDescription}`
                            : customer.salesGroup || "-"}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">Customer Group</th>
                        <td>
                          {customer.customerGroupDescription
                            ? `${customer.customerGroup} - ${customer.customerGroupDescription}`
                            : customer.customerGroup || "-"}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">Price List</th>
                        <td>
                          {customer.priceListDescription
                            ? `${customer.priceList} - ${customer.priceListDescription}`
                            : customer.priceList || "-"}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">Address 1</th>
                        <td>{customer.address1 || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Address 2</th>
                        <td>{customer.address2 || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">City</th>
                        <td>{customer.city || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Country</th>
                        <td>{customer.country || "-"}</td>
                      </tr>

                      <tr>
                        <th className="bg-light">Pincode</th>
                        <td>{customer.pincode || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onBack}
                disabled={loading}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Results
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void onSave();
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Save Customer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerReview;
