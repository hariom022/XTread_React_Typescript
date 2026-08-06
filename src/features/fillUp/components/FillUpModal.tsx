type Props = {
  selectedItem: any;

  fillUpType: string;

  setFillUpType: React.Dispatch<React.SetStateAction<string>>;

  fillUpTypes: FillUpType[];

  handleSave: () => void;

  onClose: () => void;
};
interface FillUpType {
  fillUpTypeId: number;
  displayName: string;
}

const FillUpModal = ({
  selectedItem,

  fillUpType,
  setFillUpType,

  fillUpTypes,

  handleSave,
  onClose,
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

            <div className="modal-header d-flex align-items-center">
              <h5 className="modal-title flex-grow-1 text-white text-start">
                Fill Up - APPROVAL
              </h5>

              <div className="me-3 text-white text-end">
                <div>John</div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => {
                  setFillUpType("");

                  onClose();
                }}
              />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {/* TOP INFO */}
              <div className="mb-2">
                <div className="modal-info m-0 p-1 mb-1 row text-nowrap">
                  <div className="col">
                    <strong>Production No</strong>
                    <div>{selectedItem?.casing}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Ref No</strong>
                    <div>{selectedItem?.serial}</div>
                  </div>

                  <div className="col">
                    <strong>Customer Name</strong>
                    <div>{selectedItem?.customerName}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Size</strong>
                    <div>{selectedItem?.tyreSize}</div>
                  </div>

                  <div className="col">
                    <strong>Requested Pattern</strong>
                    <div>
                      <div>{selectedItem?.requestedPattern || "-"}</div>
                    </div>
                  </div>

                  <div className="col">
                    <strong>ReApproved Pattern</strong>
                    <div>{selectedItem?.reApprovedPattern}</div>
                  </div>
                </div>
              </div>

              {/* FILLUP */}

              <div className="row justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">Fill Up Type</label>

                  <select
                    className="form-select"
                    value={fillUpType}
                    onChange={(e) => setFillUpType(e.target.value)}
                  >
                    <option value="" selected disabled>
                      Select Fill Up Type
                    </option>

                    {fillUpTypes.map((item) => (
                      <option key={item.fillUpTypeId} value={item.fillUpTypeId}>
                        {item.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-success w-100"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default FillUpModal;
