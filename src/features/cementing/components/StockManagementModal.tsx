import React from "react";

interface StockManagementModalProps {
  openingStockKg: number | undefined;
  setOpeningStockKg: React.Dispatch<React.SetStateAction<number | undefined>>;

  closingStockKg: number | undefined;
  setClosingStockKg: React.Dispatch<React.SetStateAction<number | undefined>>;

  onClose: () => void;
}

const StockManagementModal: React.FC<
  StockManagementModalProps
> = ({
  openingStockKg,
  setOpeningStockKg,
  closingStockKg,
  setClosingStockKg,
  onClose,
}) => {
  const handleSave = () => {
    console.log({
      openingStockKg,
      closingStockKg,
    });

    onClose();
  };

  return (
    <>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                Stock Management
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <label
                  className="fw-semibold mb-0 text-nowrap"
                  style={{ minWidth: "160px" }}
                >
                  Opening Stock (kgs)
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={openingStockKg}
                  onChange={(e) =>
                    setOpeningStockKg(
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="d-flex align-items-center gap-3">
                <label
                  className="fw-semibold mb-0 text-nowrap"
                  style={{ minWidth: "160px" }}
                >
                  Closing Stock (kgs)
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={closingStockKg}
                  onChange={(e) =>
                    setClosingStockKg(
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              {/* <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button> */}

              <button
                className="btn btn-success"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
};

export default StockManagementModal;