import { useState } from "react";

import PdfUpload from "./PdfUpload";
import ShearographyChecklistModal from "./ShearographyChecklistModal";

import { SHEAROGRAPHY_CHECKLIST } from "../constants/shearographyChecklist";

import shearographyService from "../service/shearographyService";

type Props = {
  item: any;
  rejectionReasons: any[];
  onClose: () => void;
  onSuccess: () => void;
};

const ShearographyModal = ({
  item,
  rejectionReasons,
  onClose,
  onSuccess,
}: Props) => {
  const [reason, setReason] = useState("");

  const [showChecklist, setShowChecklist] = useState(false);

  const [checklistSaved, setChecklistSaved] = useState(false);

  const [checkedChecklist, setCheckedChecklist] = useState<string[]>([]);

  const [selectAllChecklist, setSelectAllChecklist] = useState(false);

  const [pdfFiles, setPdfFiles] = useState<any[]>([]);

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const toggleChecklist = (id: string) => {
    setCheckedChecklist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      setSelectAllChecklist(updated.length === SHEAROGRAPHY_CHECKLIST.length);

      return updated;
    });
  };

  const handleSelectAllChecklist = () => {
    if (selectAllChecklist) {
      setCheckedChecklist([]);
      setSelectAllChecklist(false);
    } else {
      setCheckedChecklist(SHEAROGRAPHY_CHECKLIST.map((x) => x.id));

      setSelectAllChecklist(true);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPdfFiles((prev) => [...prev, ...newFiles]);
  };

  const removePdf = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApprove = async () => {
    if (!checklistSaved) {
      alert("Please complete checklist first");
      return;
    }

    const formData = new FormData();

    formData.append("orderCasingIds", item.id);

    formData.append("isApproved", "true");

    pdfFiles.forEach((pdf) => {
      formData.append("pdfs", pdf.file);
    });

    await shearographyService.handleApprovalRejection(formData);

    alert("Approved Successfully");

    onSuccess();

    onClose();
  };

  const handleReject = async () => {
    if (!reason) {
      alert("Please select rejection reason");
      return;
    }

    const formData = new FormData();

    formData.append("orderCasingIds", item.id);

    formData.append("isApproved", "false");

    formData.append("rejectionReasonCode", reason);

    pdfFiles.forEach((pdf) => {
      formData.append("pdfs", pdf.file);
    });

    await shearographyService.handleApprovalRejection(formData);

    alert("Rejected Successfully");

    onSuccess();

    onClose();
  };

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div
            className={`modal-content ${showChecklist ? "blur-approval" : ""}`}
          >
            {/* Header
          <div className="modal-header shearo-header">
            <h5 className="modal-title w-100">
              SHEAROGRAPHY - APPROVAL
            </h5>

            <div className="me-3 text-white text-end">
              <div>John</div>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div> */}
            {/* HEADER */}
            <div className="modal-header nail-header">
              <h5 className="modal-title">SHEAROGRAPHY - APPROVAL</h5>
              {/* STAFF NAME */}
              <div
                className="me-3 text-white text-end"
                style={{ marginLeft: "46rem" }}
              >
                {/* <strong className="fw-semibold d-block">Staff Name</strong> */}
                <b>John</b>
              </div>
              {/* CLOSE (X) BUTTON */}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Top Information */}
              <div className="modal-info m-0 p-2 building-top row text-nowrap">
                <div className="col">
                  <strong>Production No</strong>
                  <div>{item?.casing}</div>
                </div>

                <div className="col">
                  <strong>Serial No</strong>
                  <div>{item?.serial}</div>
                </div>

                <div className="col">
                  <strong>Customer Name</strong>
                  <div>{item?.customerName || "-"}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{item?.tyreSize || "-"}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>{item?.requestedPattern || item?.pattern || "-"}</div>
                </div>
              </div>

              {/* Checklist + Rejection */}
              <div className="row g-3 mt-2">
                <div className="col-md-6 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    style={{height: "2.75rem"}}
                    onClick={() => setShowChecklist(true)}
                  >
                    Shearography Checklist
                  </button>
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="" hidden>
                      Select Rejection Reason
                    </option>

                    {rejectionReasons.map((reasonItem: any) => (
                      <option
                        key={reasonItem.rejectionReasonId}
                        value={reasonItem.code}
                      >
                        {reasonItem.reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PDF Upload */}
                <PdfUpload
                  pdfFiles={pdfFiles}
                  previewIndex={previewIndex}
                  setPreviewIndex={setPreviewIndex}
                  handlePdfUpload={handlePdfUpload}
                  removePdf={removePdf}
                />
              </div>

              {/* Action Buttons */}
              <div className="row g-3 mt-4">
                <div className="col-md-4">
                  <button
                    className="btn btn-warning HOLD w-100 d-flex align-items-center justify-content-center gap-3"
                    style={{
                      height: "7.25rem",
                    }}
                  >
                    <span>HOLD – Awaiting Customer LPO</span>

                    <span className="icon-box">
                      <i className="bi bi-pause-circle"></i>
                    </span>
                  </button>
                </div>

                <div className="col-md-4">
                  <button
                    className="btn btn-approve w-100 d-flex align-items-center justify-content-center gap-3"
                    onClick={handleApprove}
                  >
                    <span>APPROVED</span>

                    <span className="icon-box">
                      <i className="bi bi-check-lg"></i>
                    </span>
                  </button>
                </div>

                <div className="col-md-4">
                  <button
                    className="btn btn-reject w-100 d-flex align-items-center justify-content-center gap-3"
                    onClick={handleReject}
                  >
                    <span>REJECTED</span>

                    <span className="icon-box">
                      <i className="bi bi-x-lg"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Modal */}
      {showChecklist && (
        <ShearographyChecklistModal
          show={showChecklist}
          checkedChecklist={checkedChecklist}
          selectAllChecklist={selectAllChecklist}
          setChecklistSaved={setChecklistSaved}
          setShow={setShowChecklist}
          toggleChecklist={toggleChecklist}
          handleSelectAllChecklist={handleSelectAllChecklist}
          resetChecklist={() => setShowChecklist(false)}
        />
      )}
    </>
  );
};

export default ShearographyModal;
// import PdfUpload from "./PdfUpload";

// type Props = {
//   selected: any;

//   reason: string;
//   setReason: (value: string) => void;

//   rejectionReasons: any[];

//   pdfFiles: any[];
//   previewIndex: number | null;
//   setPreviewIndex: React.Dispatch<
//     React.SetStateAction<number | null>
//   >;

//   handlePdfUpload: (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => void;

//   removePdf: (index: number) => void;

//   handleApprove: () => void;
//   handleReject: () => void;
//   handleHold: () => void;

//   setShowShearoChecklist: (
//     value: boolean
//   ) => void;

//   showShearoChecklist: boolean;

//   modalRef: React.RefObject<HTMLDivElement>;
// };

// const ShearographyModal = ({
//   selected,
//   reason,
//   setReason,
//   rejectionReasons,
//   pdfFiles,
//   previewIndex,
//   setPreviewIndex,
//   handlePdfUpload,
//   removePdf,
//   handleApprove,
//   handleReject,
//   handleHold,
//   setShowShearoChecklist,
//   modalRef,
// showShearoChecklist,
// }: Props) => {
//   return (
//     <div
//       className="modal fade"
//       ref={modalRef}
//       tabIndex={-1}
//       aria-hidden="true"
//     >
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">
//           {/* HEADER */}
//           <div className="modal-header shearo-header">
//             <h5 className="modal-title w-100">
//               SHEAROGRAPHY - APPROVAL
//             </h5>

//             <div className="me-3 text-white text-end">
//               <div>John</div>
//             </div>

//             <button
//               type="button"
//               className="btn-close btn-close-white"
//               data-bs-dismiss="modal"
//             />
//           </div>

//           {/* BODY */}
//           <div className="modal-body">
//             {/* Top Info */}
//             <div className="modal-info m-0 p-2 building-top row text-nowrap">
//               <div className="col">
//                 <strong>Production No</strong>
//                 <div>{selected?.casing}</div>
//               </div>

//               <div className="col">
//                 <strong>Serial No</strong>
//                 <div>{selected?.serial}</div>
//               </div>

//               <div className="col">
//                 <strong>Customer Name</strong>
//                 <div>
//                   {selected?.customerName || "-"}
//                 </div>
//               </div>

//               <div className="col">
//                 <strong>Tyre Size</strong>
//                 <div>
//                   {selected?.tyreSize || "-"}
//                 </div>
//               </div>

//               <div className="col">
//                 <strong>Requested Pattern</strong>

//                 <div>
//                   {selected?.requestedPattern ||
//                     selected?.pattern ||
//                     "-"}
//                 </div>
//               </div>
//             </div>

//             {/* Checklist + Rejection */}
//             <div className="row g-3 mt-2">
//               <div className="col-md-6 d-flex align-items-end">
//                 <button
//                   type="button"
//                   className="btn btn-primary w-100"
//                   onClick={() =>
//                     setShowShearoChecklist(true)
//                   }
//                 >
//                   Shearography Checklist
//                 </button>
//               </div>

//               <div className="col-md-6">
//                 <select
//                   className="form-select"
//                   value={reason}
//                   onChange={(e) =>
//                     setReason(e.target.value)
//                   }
//                 >
//                   <option value="" hidden>
//                     Select Rejection Reason
//                   </option>

//                   {rejectionReasons.map(
//                     (item: any) => (
//                       <option
//                         key={
//                           item.rejectionReasonId
//                         }
//                         value={item.code}
//                       >
//                         {item.reason}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>

//               <PdfUpload
//                 pdfFiles={pdfFiles}
//                 previewIndex={previewIndex}
//                 setPreviewIndex={
//                   setPreviewIndex
//                 }
//                 handlePdfUpload={
//                   handlePdfUpload
//                 }
//                 removePdf={removePdf}
//               />
//             </div>

//             {/* Footer Buttons */}
//             <div className="row g-3 mt-4">
//               <div className="col-md-4">
//                 <button
//                   className="btn btn-warning HOLD w-100 d-flex align-items-center justify-content-center gap-3"
//                   onClick={handleHold}
//                 >
//                   <span>
//                     HOLD – Awaiting Customer LPO
//                   </span>

//                   <span className="icon-box">
//                     <i className="bi bi-pause-circle"></i>
//                   </span>
//                 </button>
//               </div>

//               <div className="col-md-4">
//                 <button
//                   className="btn btn-approve w-100 d-flex align-items-center justify-content-center gap-3"
//                   onClick={handleApprove}
//                 >
//                   <span>APPROVED</span>

//                   <span className="icon-box">
//                     <i className="bi bi-check-lg"></i>
//                   </span>
//                 </button>
//               </div>

//               <div className="col-md-4">
//                 <button
//                   className="btn btn-reject w-100 d-flex align-items-center justify-content-center gap-3"
//                   onClick={handleReject}
//                 >
//                   <span>REJECTED</span>

//                   <span className="icon-box">
//                     <i className="bi bi-x-lg"></i>
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShearographyModal;
