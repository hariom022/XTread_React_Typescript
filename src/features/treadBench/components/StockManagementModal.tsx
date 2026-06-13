// components/StockManagementModal.tsx

import React from "react";
import {
  type WasteForm,
  type StockManagementModalProps,
} from "../types/treadBenchTypes";

const StockManagementModal: React.FC<StockManagementModalProps> = ({
  wasteForm,
  setWasteForm,
  wasteRows,
  setWasteRows,
  setWaste,
  onClose,
  //   stockModalRef,
}) => {
  const handleAddWaste = () => {
    if (!wasteForm.wasteKg || !wasteForm.treadPattern || !wasteForm.width) {
      alert("Please fill all fields");
      return;
    }

    setWasteRows([...wasteRows, wasteForm]);

    setWasteForm({
      wasteKg: "",
      treadPattern: "",
      width: "",
      cementType: "",
    });
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header stock-mgt">
            <h5 className="modal-title">Stock Management</h5>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="row g-3 mb-3">
              {/* Tread Pattern */}
              <div className="col-md-3">
                <label className="form-label">Tread Pattern</label>

                <select
                  className="form-select"
                  value={wasteForm.treadPattern}
                  onChange={(e) =>
                    setWasteForm({
                      ...wasteForm,
                      treadPattern: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="UD3">UD3</option>
                  <option value="UD4">UD4</option>
                  <option value="RZM530L">RZM530L</option>
                  <option value="RZL140A">RZL140A</option>
                </select>
              </div>

              {/* Width */}
              <div className="col-md-3">
                <label className="form-label">Width</label>

                <select
                  className="form-select"
                  value={wasteForm.width}
                  onChange={(e) =>
                    setWasteForm({
                      ...wasteForm,
                      width: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="295">295</option>
                  <option value="315">315</option>
                  <option value="11.00">11.00</option>
                  <option value="10.00">10.00</option>
                </select>
              </div>

              {/* Waste */}
              <div className="col-md-3">
                <label className="form-label">Waste (kgs)</label>

                <input
                  type="number"
                  className="form-control"
                  value={wasteForm.wasteKg}
                  onChange={(e) =>
                    setWasteForm({
                      ...wasteForm,
                      wasteKg: e.target.value,
                    })
                  }
                />
              </div>

              {/* Add Button */}
              <div className="col-md-3">
                <label className="form-label">&nbsp;</label>

                <button
                  className="btn btn-danger w-100"
                  onClick={handleAddWaste}
                >
                  + Add Waste
                </button>
              </div>
            </div>

            {/* TABLE */}
            {wasteRows.length > 0 && (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="stock-table-head">
                    <tr>
                      <th>Waste (kgs)</th>
                      <th>Tread Pattern</th>
                      <th>Width</th>
                    </tr>
                  </thead>

                  <tbody>
                    {wasteRows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.wasteKg}</td>
                        <td>{row.treadPattern}</td>
                        <td>{row.width}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-success inspect-save-btn"
              onClick={() => {
                const total = wasteRows.reduce(
                  (sum, row) => sum + Number(row.wasteKg),
                  0,
                );

                setWaste(total);

                console.log("Waste Rows:", wasteRows);
                console.log("Total Waste:", total);

                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagementModal;
