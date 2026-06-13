import React, { useEffect, useState } from "react";

interface CementingModalProps {
  selectedItem: {
  id: number;
  casing: string;
  serial: string;

  customerName?: string;

  requestedPattern?: string;

  reApprovedPattern?: string;

  pattern: string;
  tyreSize: string;
  service: string;

  skipRepair: boolean;
  casingDry: boolean;
} | null;

  staffName: string;

  cementType: string;
  setCementType: React.Dispatch<React.SetStateAction<string>>;

  cementTypes: any[];

  handleSave: (payload: any) => Promise<any>;
  handleApprove: (payload: any) => Promise<any>;

  onClose: () => void;
}

const CementingModal: React.FC<CementingModalProps> = ({
  selectedItem,
  staffName,
  cementType,
  setCementType,
  cementTypes,
  handleSave,
  handleApprove,
  onClose,
}) => {
  const [skipRepair, setSkipRepair] = useState(false);

  const [casingDry, setCasingDry] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setSkipRepair(Boolean(selectedItem.skipRepair));

      setCasingDry(Boolean(selectedItem.casingDry));
    }
  }, [selectedItem]);

  if (!selectedItem) return null;

  const onSave = async () => {
    try {
      const payload = {
        orderCasingIds: [selectedItem.id.toString()],
        cementTypeId: cementType,
      };

      console.log("SAVE PAYLOAD", payload);
      await handleSave(payload);
      alert("Saved Successfully");
    } catch (err) {
      console.error(err);
      alert("Save Failed");
    }
  };

  const onApprove = async () => {
    const payload = {
      orderCasingIds: [selectedItem.id.toString()],
    };

    console.log("APPROVE PAYLOAD", payload);

    try {
      await handleApprove(payload);

      alert("Approved Successfully");

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="modal show d-block"
        tabIndex={-1}
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title flex-grow-1 text-white text-start">CEMENTING – INSPECTION</h5>
              <div className="me-3 text-white text-end">
                <div>John</div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="modal-info m-0 p-2 row text-nowrap">

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
                    <div>{selectedItem?.customerName || "-"}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Size</strong>
                    <div>{selectedItem?.tyreSize}</div>
                  </div>

                  <div className="col">
                    <strong>Requested Pattern</strong>
                    <div>
                      {selectedItem?.requestedPattern || "-"}
                    </div>
                  </div>

                  <div className="col">
                    <strong>ReApproved Pattern</strong>
                    <div>
                      {selectedItem?.reApprovedPattern || "-"}
                    </div>
                  </div>

                </div>
              </div>

              <div className="d-flex flex-column align-items-center ">

                {/* TOP ROW */}
                <div
                  className="d-flex justify-content-center align-items-center gap-5 mb-4"
                  style={{ width: "100%" }}
                >

                  {/* Skip Repair */}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={skipRepair}
                      disabled
                    />

                    <label className="form-check-label ms-2">
                      Skip Repair
                    </label>
                  </div>

                  {/* Casing Dry */}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={casingDry}
                      onChange={(e) =>
                        setCasingDry(e.target.checked)
                      }
                    />

                    <label className="form-check-label ms-2">
                      Casing Dry
                    </label>
                  </div>

                </div>

                {/* MIDDLE ROW */}
                <div
                  className="d-flex justify-content-center align-items-end gap-3 mb-5"
                  style={{ width: "100%" }}
                >

                  <div style={{ minWidth: "350px" }}>

                    <label className="form-label">
                      Cement Type
                    </label>

                    <select
                      className="form-select"
                      value={cementType}
                      onChange={(e) =>
                        setCementType(e.target.value)
                      }
                    >
                      <option value="">
                        Select Cement Type
                      </option>

                      {cementTypes.map((item: any) => (
                        <option
                          key={item.cementTypeId}
                          value={item.cementTypeId}
                        >
                          {item.displayName}
                        </option>
                      ))}
                    </select>

                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={onSave}
                    style={{
                      minWidth: "140px",
                      height: "38px",
                    }}
                  >
                    Save
                  </button>

                </div>

                {/* APPROVE BUTTON */}
                <div
                  className="d-flex justify-content-center"
                  style={{ width: "100%" }}
                >

                  <div style={{ width: "300px" }}>

                    <button
                      className="btn btn-approve w-100 d-flex align-items-center justify-content-center"
                      onClick={onApprove}
                      disabled={!casingDry}
                    >
                      <span>APPROVED</span>

                      <span className="icon-box">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    </button>

                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
};

export default CementingModal;
