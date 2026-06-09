import { useState } from "react";

const StockManagementModal = ({ onClose }: any) => {
  const [openingStock, setOpeningStock] = useState("185");
  const [closingStock, setClosingStock] = useState("190");

  const save = () => {
    console.log({
      openingStock,
      closingStock,
    });

    alert("Saved Successfully");
    onClose();
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          background: "rgba(0,0,0,.35)",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content stock-modal">

            {/* Header */}

            <div className="modal-header stock-header">

              <h3 className="mb-0 fw-bold">
                Stock Management
              </h3>

              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              />

            </div>

            {/* Body */}

            <div className="modal-body">

  <div className="row mb-3 align-items-center">

    <div className="col-5">
      <label className="stock-label">
        Opening Stock (kgs)
      </label>
    </div>

    <div className="col-7">
      <input
        type="text"
        className="form-control stock-input"
        value={openingStock}
        onChange={(e)=>
          setOpeningStock(e.target.value)
        }
      />
    </div>

  </div>

  <div className="row align-items-center">

    <div className="col-5">
      <label className="stock-label">
        Closing Stock (kgs)
      </label>
    </div>

    <div className="col-7">
      <input
        type="text"
        className="form-control stock-input"
        value={closingStock}
        onChange={(e)=>
          setClosingStock(e.target.value)
        }
      />
    </div>

  </div>

</div>

            {/* Footer */}

            <div className="modal-footer">

              <button
                className="btn btn-success stock-save-btn"
                onClick={save}
              >
                Save
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StockManagementModal;