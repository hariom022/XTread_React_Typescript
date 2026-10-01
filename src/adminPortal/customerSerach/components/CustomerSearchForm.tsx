import { useState } from "react";

import type {
  CustomerSearchRequest,
} from "../types/customerSearch.type";

interface CustomerSearchFormProps {
  loading: boolean;
  onSearch: (
    payload: CustomerSearchRequest,
  ) => void;
}

const CustomerSearchForm = ({
  loading,
  onSearch,
}: CustomerSearchFormProps) => {
  const [sapNumber, setSapNumber] = useState("");

  const [customerName, setCustomerName] =
    useState("");

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (
      !sapNumber.trim() &&
      !customerName.trim()
    ) {
      alert(
        "Please enter SAP Number or Customer Name.",
      );

      return;
    }

    onSearch({
      sapNumber: sapNumber.trim(),
      customerName: customerName.trim(),
    });
  };

  // ==========================================
  // CLEAR
  // ==========================================

  const handleClear = () => {
    setSapNumber("");
    setCustomerName("");
  };

  return (
    <div className="card shadow-sm mt-4">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="card-header bg-white border-0 pt-4 px-4">
        <div className="d-flex align-items-start">
          <div>
            <h4 className="mb-1">
              Customer Search
            </h4>

            <p className="text-muted mb-0">
              Enter SAP Number or Customer Name and click Search.
            </p>
          </div>

        </div>
      </div>

      {/* ========================================
          BODY
      ======================================== */}

      <div className="card-body px-4 pb-4">

        <div className="card border">

          <div className="card-header bg-light">
            <h6 className="mb-0">
              Search Customer
            </h6>
          </div>

          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="row">

                {/* SAP NUMBER */}

                <div className="col-md-6 mb-3">

                  <label
                    htmlFor="sapNumber"
                    className="form-label"
                  >
                    SAP Number
                  </label>

                  <input
                    type="text"
                    id="sapNumber"
                    className="form-control"
                    placeholder="Enter SAP number"
                    value={sapNumber}
                    onChange={(e) =>
                      setSapNumber(e.target.value)
                    }
                  />

                </div>

                {/* CUSTOMER NAME */}

                <div className="col-md-6 mb-3">

                  <label
                    htmlFor="customerName"
                    className="form-label"
                  >
                    Customer Name
                  </label>

                  <input
                    type="text"
                    id="customerName"
                    className="form-control"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value,
                      )
                    }
                  />

                </div>

              </div>

              {/* ==================================
                  BUTTONS
              ================================== */}

              <div className="d-flex justify-content-end gap-2 mt-2">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClear}
                  disabled={loading}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    (!sapNumber.trim() &&
                      !customerName.trim())
                  }
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Search
                    </>
                  )}
                </button>

              </div>

              {/* ==================================
                  INFO
              ================================== */}

              <div className="alert alert-info py-2 mt-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>

                You can enter SAP Number or Customer
                Name to search for the customer.
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerSearchForm;