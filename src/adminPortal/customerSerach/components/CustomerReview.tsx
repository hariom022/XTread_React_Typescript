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
      {/* BACKDROP */}

      <div className="modal-backdrop fade show"></div>

      {/* MODAL */}

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

          <div className="modal-content">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="modal-header">

              <div>

                <h5 className="modal-title">
                  Review & Confirm
                </h5>

                <small className="text">
                  Verify the selected customer details
                  before saving.
                </small>

              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onBack}
                disabled={loading}
              ></button>

            </div>

            {/* ==================================
                BODY
            ================================== */}

            <div className="modal-body">

              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="card border">

                <div className="card-header bg-light">
                  <h6 className="mb-0">
                    Selected Customer Details
                  </h6>
                </div>

                <div className="table-responsive">

                  <table className="table table-bordered mb-0">

                    <tbody>

                      <tr>
                        <th className="bg-light w-25">
                          Customer Name
                        </th>

                        <td>
                          {customer.customerName}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          Mobile Number
                        </th>

                        <td>
                          {customer.mobileNumber}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          SAP No.
                        </th>

                        <td>
                          {customer.sapNumber}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          GP No.
                        </th>

                        <td>
                          {customer.gpNumber}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          Address
                        </th>

                        <td>
                          {customer.address}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          City
                        </th>

                        <td>
                          {customer.city}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          State
                        </th>

                        <td>
                          {customer.state}
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-light">
                          Country
                        </th>

                        <td>
                          {customer.country}
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            {/* ==================================
                FOOTER
            ================================== */}

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
                onClick={onSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

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