// import React from "react";
// import { useEffect, useState } from "react";
// import { useCementing } from "../hooks/useCementing";

// interface CementingModalProps {
//   selectedItem: {
//     id: number;
//     casing: string;
//     serial: string;
//     pattern: string;
//     tyreSize: string;
//     service: string;
//     skipRepair: boolean;
//     casingDry: boolean;
//   } | null;

//   staffName: string;
//   cementType: string;
//   setCementType: React.Dispatch<React.SetStateAction<string>>;

//   cementTypes: any[];

//   handleSave: (payload: any) => Promise<any>;
//   handleApprove: (payload: any) => Promise<any>;

//   onClose: () => void;
// }

// const CementingModal: React.FC<CementingModalProps> = ({
//   selectedItem,
//   staffName,
//   cementType,
//   setCementType,
//   onClose,
// }) => {
//   const [casingDry, setCasingDry] = useState(false);

//   useEffect(() => {
//     if (selectedItem) {
//       setCasingDry(Boolean(selectedItem.casingDry));
//     }
//   }, [selectedItem]);
//   if (!selectedItem) return null;
//   const { cementTypes, loadCementTypes, handleSave, handleApprove } =
//     useCementing();
//   const onSave = async () => {
//     await handleSave({
//       orderCasingId: selectedItem.id,
//       cementTypeId: cementType,
//     });
//   };

//   const onApprove = async () => {
//     await handleApprove({
//       orderCasingId: selectedItem.id,
//     });
//   };
//   useEffect(() => {
//     loadCementTypes();
//   }, []);
//   return (
//     <>
//       <div className="modal show d-block" tabIndex={-1}>
//         <div className="modal-dialog modal-xl modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header bg-danger text-white">
//               <h5 className="modal-title flex-grow-1">
//                 CEMENTING – INSPECTION
//               </h5>

//               <span>{staffName}</span>

//               <button
//                 type="button"
//                 className="btn-close btn-close-white"
//                 onClick={onClose}
//               />
//             </div>

//             <div className="modal-body">
//               <div className="row text-center mb-3 inspect-top-row">
//                 <div className="col">
//                   <small className="inspect-label">Casing No</small>
//                   <div className="inspect-value">{selectedItem.casing}</div>
//                 </div>

//                 <div className="col">
//                   <small className="inspect-label">Serial No</small>
//                   <div className="inspect-value">{selectedItem.serial}</div>
//                 </div>

//                 <div className="col">
//                   <small className="inspect-label">Pattern</small>
//                   <div className="inspect-value">{selectedItem.pattern}</div>
//                 </div>

//                 <div className="col">
//                   <small className="inspect-label">Tyre Size</small>
//                   <div className="inspect-value">{selectedItem.tyreSize}</div>
//                 </div>

//                 <div className="col">
//                   <small className="inspect-label">Service</small>
//                   <div className="inspect-value">{selectedItem.service}</div>
//                 </div>
//               </div>

//               <div className="container-fluid my-4">
//                 <div className="row justify-content-center align-items-end g-3">
//                   <div className="col-md-4">
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         checked={Boolean(selectedItem.skipRepair)}
//                         readOnly
//                       />
//                       <label className="form-check-label">Skip Repair</label>
//                     </div>

//                     <div className="form-check mt-3">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         checked={casingDry}
//                         onChange={(e) => setCasingDry(e.target.checked)}
//                       />
//                       <label className="form-check-label">Casing Dry</label>
//                     </div>
//                     <label className="form-label">Cement Type</label>

//                     <select
//                       className="form-select"
//                       value={cementType}
//                       onChange={(e) => setCementType(e.target.value)}
//                     >
//                       <option value="">Select Cement Type</option>

//                       {cementTypes.map((item: any) => (
//                         <option
//                           key={item.cementTypeId}
//                           value={item.cementTypeId}
//                         >
//                           {item.displayName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="modal-footer">
//                     <button className="btn btn-primary" onClick={onSave}>
//                       Save
//                     </button>

//                     <button className="btn btn-success" onClick={onApprove}>
//                       Approve
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="modal-backdrop show"></div>
//     </>
//   );
// };

// export default CementingModal;

import React, { useEffect, useState } from "react";

interface CementingModalProps {
  selectedItem: {
    id: number;
    casing: string;
    serial: string;
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
      <div className="modal show d-block" tabIndex={-1}style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                CEMENTING – INSPECTION
              </h5>
              {/* STAFF NAME */}
              <div className="me-3 text-white text-end"
              style={{ marginLeft: "48rem"}}>
                {/* <strong className="fw-semibold d-block">Staff Name</strong> */}
                <b>{staffName}</b>
              </div>
              {/* <span>{staffName}</span> */}

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <div className="row text-center mb-4">
                <div className="col">
                  <small>Casing No</small>
                  <div>{selectedItem.casing}</div>
                </div>

                <div className="col">
                  <small>Serial No</small>
                  <div>{selectedItem.serial}</div>
                </div>

                <div className="col">
                  <small>Pattern</small>
                  <div>{selectedItem.pattern}</div>
                </div>

                <div className="col">
                  <small>Tyre Size</small>
                  <div>{selectedItem.tyreSize}</div>
                </div>

                <div className="col">
                  <small>Service</small>
                  <div>{selectedItem.service}</div>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-end gap-4 flex-wrap">
                {/* Skip Repair */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={skipRepair}
                    disabled
                  />
                  <label className="form-check-label">Skip Repair</label>
                </div>

                {/* Casing Dry */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={casingDry}
                    onChange={(e) => setCasingDry(e.target.checked)}
                  />
                  <label className="form-check-label">Casing Dry</label>
                </div>

                {/* Cement Type */}
                <div style={{ minWidth: "450px" }}>
                  <label className="form-label">Cement Type</label>

                  <select
                    className="form-select"
                    value={cementType}
                    disabled={skipRepair}
                    onChange={(e) => setCementType(e.target.value)}
                  >
                    <option value="">Select Cement Type</option>

                    {cementTypes.map((item: any) => (
                      <option key={item.cementTypeId} value={item.cementTypeId}>
                        {item.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-primary mb-1" onClick={onSave}>
                  Save
                </button>

                <button
                  className="btn btn-success mb-1"
                  onClick={onApprove}
                  disabled={!casingDry}
                >
                  Approve
                </button>
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
