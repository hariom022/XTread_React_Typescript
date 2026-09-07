import { useEffect, useState } from "react";

import dispatchServiceApi from "../service/dispatchServiceApi";

interface DeliveryCasing {
  orderCasingId: number;
  tyreReferenceNumber: string;
  productionNumber: string;
  tyreSizeLabel: string;
  tyreMakeName: string;
  vehicleRegistrationNumber: string;
  currentStage: number;
  currentStageStatus: number;
}

interface DeliverySheetDetails {
  deliverySheetId: number;
  deliverySheetNumber: string;
  courierType: number;
  courierServiceId: number | null;
  courierName: string;
  vehicleRegNo: string;
  driverName: string;
  driverIdNo: string;
  remarks: string;
  isApproved: boolean;
  createdAtUtc: string;
  casings: DeliveryCasing[];
}

interface Props {
  show: boolean;
  deliverySheetId: number | null;
  onClose: () => void;
}

const DispatchDetailsModal = ({ show, deliverySheetId, onClose }: Props) => {
  const [details, setDetails] = useState<DeliverySheetDetails | null>(null);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET DELIVERY SHEET DETAILS
  // ==========================================

  useEffect(() => {
    if (!show || !deliverySheetId) {
      return;
    }

    const getDetails = async () => {
      try {
        setLoading(true);

        console.log("==========================================");

        console.log("🚚 GET DELIVERY SHEET DETAILS");

        console.log("Delivery Sheet ID:", deliverySheetId);

        const response =
          await dispatchServiceApi.getDeliverySheetById(deliverySheetId);

        console.log("🚚 Delivery Sheet Details Response:", response.data);

        if (!response.data?.success) {
          console.error(
            "Delivery Sheet Details API failed:",
            response.data?.error,
          );

          setDetails(null);

          return;
        }

        setDetails(response.data.data);
      } catch (error) {
        console.error("❌ Error fetching delivery sheet details:", error);

        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [show, deliverySheetId]);

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* ======================================
                HEADER
            ====================================== */}

            <div className="modal-header">
              <h5 className="modal-title text-white">Dispatch Details</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* ======================================
                BODY
            ====================================== */}

            <div className="modal-body">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status" />

                  <div className="mt-2">Loading delivery details...</div>
                </div>
              ) : !details ? (
                <div className="text-center text-muted p-5">
                  No delivery details found.
                </div>
              ) : (
                <>
                  {/* ==================================
                      DELIVERY SHEET INFORMATION
                  ================================== */}

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="fw-bold">Delivery Sheet No</label>

                      <input
                        className="form-control"
                        value={details.deliverySheetNumber}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-bold">Courier</label>

                      <input
                        className="form-control"
                        value={details.courierName}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-bold">Vehicle Reg No</label>

                      <input
                        className="form-control"
                        value={details.vehicleRegNo}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="fw-bold">Driver Name</label>

                      <input
                        className="form-control"
                        value={details.driverName}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-bold">Driver ID</label>

                      <input
                        className="form-control"
                        value={details.driverIdNo}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-bold">Created Date</label>

                      <input
                        className="form-control"
                        value={
                          details.createdAtUtc
                            ? new Date(details.createdAtUtc).toLocaleDateString(
                                "en-GB",
                              )
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  {/* ==================================
                      CASINGS TABLE
                  ================================== */}

                  <h6 className="mb-2">
                    Delivery Casings ({details.casings.length})
                  </h6>

                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr className="bg-new">
                          {/* <th>Casing ID</th> */}

                          <th>Tyre Reference</th>

                          <th>Production No</th>

                          <th>Tyre Size</th>

                          <th>Tyre Make</th>

                          <th>Vehicle Reg No</th>

                          {/* <th>Stage</th>

                          <th>Status</th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {details.casings.length > 0 ? (
                          details.casings.map((casing) => (
                            <tr key={casing.orderCasingId}>
                              {/* <td>{casing.orderCasingId}</td> */}

                              <td>{casing.tyreReferenceNumber}</td>

                              <td>{casing.productionNumber}</td>
 
                              <td>{casing.tyreSizeLabel}</td>

                              <td>{casing.tyreMakeName}</td>

                              <td>{casing.vehicleRegistrationNumber}</td>

                              {/* <td>{casing.currentStage}</td>

                              <td>{casing.currentStageStatus}</td> */}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center text-muted">
                              No casings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* ======================================
                FOOTER
            ====================================== */}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default DispatchDetailsModal;
