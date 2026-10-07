import type { Customer } from "../types/customerSearch.type";

interface CustomerSuccessProps {
  show: boolean;
  customer: Customer | null;
  onAddAnother: () => void;
  onNextStep: () => void;
}

const CustomerSuccess = ({
  show,
  customer,
  onAddAnother,
  onNextStep,
}: CustomerSuccessProps) => {
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
        <div className="modal-dialog modal-md modal-dialog-centered">

          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">
                Success
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onAddAnother}
              />

            </div>

            <div className="modal-body">

              <div className="alert alert-success text-center mb-0">

                <div className="mb-3">

                  <div
                    className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "64px",
                      height: "64px",
                    }}
                  >
                    <i className="bi bi-check-lg fs-1"></i>
                  </div>

                </div>

                <h4 className="text-success fw-bold">
                  Customer Saved Successfully!
                </h4>

                <p className="mb-4">
                  The selected customer has been
                  saved in the system.
                </p>

                <div className="card bg-white border-0 text-start mb-4">

                  <div className="card-body">

                    <div className="row mb-2">

                      <div className="col-5 text-muted">
                        Customer Number
                      </div>

                      <div className="col-7 fw-semibold">
                        {customer.customerNumber}
                      </div>

                    </div>

                    <div className="row mb-2">

                      <div className="col-5 text-muted">
                        Customer Name
                      </div>

                      <div className="col-7 fw-semibold">
                        {customer.customerName}
                      </div>

                    </div>

                    <div className="row">

                      <div className="col-5 text-muted">
                        Mobile Number
                      </div>

                      <div className="col-7 fw-semibold">
                        {customer.mobileNumber || "-"}
                      </div>

                    </div>

                  </div>

                </div>

                <div className="d-flex justify-content-center gap-2 flex-wrap">

                  {/* <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onAddAnother}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Another Customer
                  </button> */}

                  {/* <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onNextStep}
                  >
                    Go to Next Step
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button> */}

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default CustomerSuccess;