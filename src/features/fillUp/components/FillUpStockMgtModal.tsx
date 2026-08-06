type Props = {
  onClose: () => void;

  fillUpType: string;
  setFillUpType: React.Dispatch<React.SetStateAction<string>>;

  openingStock: string;
  setOpeningStock: React.Dispatch<React.SetStateAction<string>>;

  closingStock: string;
  setClosingStock: React.Dispatch<React.SetStateAction<string>>;

  wasteFillUpType: string;
  setWasteFillUpType: React.Dispatch<React.SetStateAction<string>>;

  wasteKg: string;
  setWasteKg: React.Dispatch<React.SetStateAction<string>>;

  fillUpTypes: {
    fillUpTypeId: number;
    displayName: string;
  }[];

  consumptionList: any[];

  wastageList: any[];

  addConsumption: () => void;

  addWastage: () => void;
};

const FillUpStockMgtModal = ({
  onClose,

  fillUpType,
  setFillUpType,

  openingStock,
  setOpeningStock,

  closingStock,
  setClosingStock,

  wasteFillUpType,
  setWasteFillUpType,

  wasteKg,
  setWasteKg,

  fillUpTypes,

  consumptionList,

  wastageList,

  addConsumption,

  addWastage,
}: Props) => {
  return (
    <>
      <div
        className="modal fade show d-block"
        style={{
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}

            <div className="modal-header">
              <h5 className="modal-title">Stock Management</h5>

              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {/* CONSUMPTION ESTIMATE */}

              <h5 className="fw-bold mb-3">Consumption Estimate</h5>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Fill Up Type</label>

                  <select
                    className="form-select"
                    value={fillUpType}
                    onChange={(e) => setFillUpType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Fill Up Type
                    </option>

                    {fillUpTypes.map((item) => (
                      <option key={item.fillUpTypeId} value={item.fillUpTypeId}>
                        {item.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Opening Stock (kg)</label>

                  <input
                    type="number"
                    className="form-control"
                    value={openingStock}
                    onChange={(e) => setOpeningStock(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Closing Stock (kg)</label>

                  <input
                    type="number"
                    className="form-control"
                    value={closingStock}
                    onChange={(e) => setClosingStock(e.target.value)}
                  />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-primary w-100"
                    onClick={addConsumption}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* CONSUMPTION TABLE */}

              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Fill Up Type</th>
                    <th>Opening</th>
                    <th>Closing</th>
                  </tr>
                </thead>

                <tbody>
                  {consumptionList.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No data added yet</td>
                    </tr>
                  ) : (
                    consumptionList.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {fillUpTypes.find(
                            (type) =>
                              type.fillUpTypeId.toString() ===
                              item.fillUpType.toString(),
                          )?.displayName || item.fillUpType}
                        </td>

                        <td>{item.openingStock}</td>

                        <td>{item.closingStock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* WASTAGE */}

              <h5 className="fw-bold mt-4 mb-3">Wastage</h5>

              <div className="row g-3 mb-3">
                <div className="col-md-5">
                  <label className="form-label">Fill Up Type</label>

                  <select
                    className="form-select"
                    value={wasteFillUpType}
                    onChange={(e) => setWasteFillUpType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Fill Up Type
                    </option>
                    {fillUpTypes.map((item) => (
                      <option key={item.fillUpTypeId} value={item.fillUpTypeId}>
                        {item.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-5">
                  <label className="form-label">Wastage (kg)</label>

                  <input
                    type="number"
                    className="form-control"
                    value={wasteKg}
                    onChange={(e) => setWasteKg(e.target.value)}
                  />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-primary w-100"
                    onClick={addWastage}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* WASTAGE TABLE */}

              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Fill Up Type</th>
                    <th>Waste (kg)</th>
                  </tr>
                </thead>

                <tbody>
                  {wastageList.length === 0 ? (
                    <tr>
                      <td colSpan={2}>No wastage added yet</td>
                    </tr>
                  ) : (
                    wastageList.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {fillUpTypes.find(
                            (type) =>
                              type.fillUpTypeId.toString() ===
                              item.wasteFillUpType.toString(),
                          )?.displayName || item.wasteFillUpType}
                        </td>

                        <td>{item.wasteKg} kg</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}

            <div className="modal-footer">
              <button className="btn btn-success" onClick={onClose}>
                Save All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default FillUpStockMgtModal;
