import React from "react";

interface Props {
  selectedItem: any;

  rejectReason: string;
  setRejectReason: (value: string) => void;

  rejectComment: string;
  setRejectComment: (value: string) => void;

  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

const QualityControlRetreadModal = ({
    selectedItem,
  rejectReason,
  setRejectReason,
  rejectComment,
  setRejectComment,
  onApprove,
  onReject,
  onClose,
}: Props) => {
  if (!selectedItem) return null;

  return (
    <>
      <div className="modal-info m-0 p-2 building-top row text-nowrap">
        <div className="col-2">
          <strong>Production No</strong>
          <div>{selectedItem.productionNumber}</div>
        </div>

        <div className="col-2">
          <strong>Serial No</strong>
          <div>{selectedItem.serial}</div>
        </div>

        <div className="col-2">
          <strong>Customer Name</strong>
          <div>{selectedItem.customerName}</div>
        </div>

        <div className="col-2">
          <strong>Tyre Size</strong>
          <div>{selectedItem.tyreSize}</div>
        </div>

        <div className="col-2">
          <strong>Requested Pattern</strong>
          <div>{selectedItem.requestedPattern}</div>
        </div>
      </div>

      <div className="row align-items-stretch">
        <div className="col-md-6 p-3">
          <div className="panel-box">
            <div className="panel-body p-3">
                {selectedItem.repairOperations?.length > 0 && (
  <div className="mt-4">
    <h5 className="mb-3">
      Repair Details
    </h5>

    <table className="table table-bordered text-center">
      <thead>
        <tr>
          <th>#Patch</th>
          <th>Location</th>
          <th>Damage Type</th>
          <th>Quantity</th>
        </tr>
      </thead>

      <tbody>
        {selectedItem.repairOperations.map(
          (repair: any) => (
            <tr key={repair.lineNumber}>
              <td>{repair.lineNumber}</td>
              <td>{repair.repairLocation}</td>
              <td>{repair.repairType}</td>
              <td>{repair.quantity}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  </div>
)}
              <table className="table table-bordered compact-table">
                <tbody>
                  <tr>
                    <td width="40%">
                      <strong>Requested Pattern</strong>
                    </td>
                    <td>{selectedItem.requestedPattern}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Approved Pattern</strong>
                    </td>
                    <td>{selectedItem.approvedPattern}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Approved Width</strong>
                    </td>
                    <td>{selectedItem.treadWidth}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Service Type</strong>
                    </td>
                    <td>{selectedItem.serviceType}</td>
                  </tr>
                </tbody>
              </table>
              
            </div>
          </div>
        </div>

        <div className="col-md-6 p-3">
          <div className="panel-box">
            <div className="panel-body p-4">
              <button className="btn btn-approve w-100 mb-3">
                APPROVED
              </button>

              <label className="fw-semibold">
                Rejection Reason
              </label>

              <select
                className="form-select mb-2"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              >
                <option value="">Select Reason</option>
                <option>Pattern Mismatch</option>
                <option>Tread Width Error</option>
                <option>Failed Inspection</option>
              </select>

              {rejectComment && (
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectComment}
                  onChange={(e) =>
                    setRejectComment(e.target.value)
                  }
                />
              )}

              <button className="btn btn-reject w-100 mt-3">
                REJECTED
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QualityControlRetreadModal;