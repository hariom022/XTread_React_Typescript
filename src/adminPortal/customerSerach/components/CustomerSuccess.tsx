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
            {/* BACKDROP */}

            <div className="modal-backdrop fade show"></div>

            {/* MODAL */}

            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-md modal-dialog-centered">

                    <div className="modal-content">

                        {/* ==================================
                HEADER
            ================================== */}

                        <div className="modal-header">

                            <div>

                                <h5 className="modal-title">
                                    Success
                                </h5>
                                {/*  <small className="text-muted">
                                    Customer is saved in the database
                                    and confirmation is shown.
                                    </small> */}

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onAddAnother}
                            ></button>

                        </div>

                        {/* ==================================
                BODY
            ================================== */}

                        <div className="modal-body">

                            <div className="alert alert-success text-center mb-0">

                                {/* CHECK ICON */}

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
                                    The selected customer has been saved
                                    in the system.
                                </p>

                                {/* CUSTOMER SUMMARY */}

                                <div className="card bg-white border-0 text-start mb-4">

                                    <div className="card-body">

                                        <div className="row mb-2">

                                            <div className="col-5 text-muted">
                                                Customer Name
                                            </div>

                                            <div className="col-7 fw-semibold">
                                                {customer.customerName}
                                            </div>

                                        </div>

                                        <div className="row mb-2">

                                            <div className="col-5 text-muted">
                                                SAP No.
                                            </div>

                                            <div className="col-7 fw-semibold">
                                                {customer.sapNumber}
                                            </div>

                                        </div>

                                        <div className="row">

                                            <div className="col-5 text-muted">
                                                GP No.
                                            </div>

                                            <div className="col-7 fw-semibold">
                                                {customer.gpNumber}
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* BUTTONS */}

                                <div className="d-flex justify-content-center gap-2 flex-wrap">

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={onAddAnother}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Add Another Customer
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={onNextStep}
                                    >
                                        Go to Next Step
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>

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