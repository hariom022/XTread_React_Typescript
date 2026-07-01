import { useMemo, useState } from "react";

import { RingLoader } from "react-spinners";

import IncidentReportModal from "../../../shared/components/IncidentReportModal";

import indexPageApiService from "../../../shared/services/indexPageApiService";

import QualityControlIndexTable from "../components/QualityControlIndexTable";

// import QualityControlModal from "../components/QualityControlModal";
import QualityControlRepairModal from "../components/QualityControlRepairModal";
import QualityControlRetreadModal from "../components/QualityControlRetreadModal";
import useQualityControlModal from "../hooks/useQualityControlModal";

import useQualityControlIndexTable from "../hooks/useQualityControlIndexTable";

import type { QualityControlRow } from "../type/qualityControl.type";

const QualityControl = () => {
  const { rows, loading, fetchRows } = useQualityControlIndexTable();
  const qualityModal = useQualityControlModal();
  const [search, setSearch] = useState("");

  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // const [
  //     showModal,
  //     setShowModal,
  // ] = useState(false);

  const searchedData = useMemo(() => {
    return rows.filter((item) =>
      `${item.productionNumber}
           ${item.tyreReferenceNumber}
           ${item.patternName}
           ${item.customerName}
           ${item.batchNumber}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [rows, search]);

  //   const handleInspect = async (item: QualityControlRow) => {
  //     await qualityModal.openModal(item);
  //   };

  const handleInspect = async (item: QualityControlRow) => {
    console.log("Inspect clicked", item);

    await qualityModal.openModal(item);
  };
  return (
    <div className="container-fluid mt-3">
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-danger w-100"
            style={{
              height: "43px",
            }}
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Report
          </button>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: "400px",
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <QualityControlIndexTable
          data={searchedData}
          onInspect={handleInspect}
        />
      )}

      {qualityModal.showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Quality Control Approval</h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={qualityModal.closeModal}
                />
              </div>

              <div className="modal-body">
                {qualityModal.showModal &&
                  (qualityModal.selectedItem?.serviceType === "Repair" ? (
                    <QualityControlRepairModal
                      selectedItem={qualityModal.selectedItem}
                      rejectReason={qualityModal.rejectReason}
                      setRejectReason={qualityModal.setRejectReason}
                      rejectionReasons={qualityModal.rejectionReasons}
                      rejectComment={qualityModal.rejectComment}
                      setRejectComment={qualityModal.setRejectComment}
                      onApprove={() => {
                        qualityModal.closeModal();
                        fetchRows();
                      }}
                      onReject={() => {
                        qualityModal.closeModal();
                        fetchRows();
                      }}
                      onClose={qualityModal.closeModal}
                    />
                  ) : (
                    <QualityControlRetreadModal
                      selectedItem={qualityModal.selectedItem}
                      rejectReason={qualityModal.rejectReason}
                      setRejectReason={qualityModal.setRejectReason}
                      rejectionReasons={qualityModal.rejectionReasons}

                      rejectComment={qualityModal.rejectComment}
                      setRejectComment={qualityModal.setRejectComment}
                      onApprove={() => {
                        qualityModal.closeModal();
                        fetchRows();
                      }}
                      onReject={() => {
                        qualityModal.closeModal();
                        fetchRows();
                      }}
                      onClose={qualityModal.closeModal}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}
    </div>
  );
};

export default QualityControl;
