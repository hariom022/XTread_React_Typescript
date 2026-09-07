import useDispatchFinalizationModal from "../hooks/useDispatchFinallizationModal";
import { useState } from "react";

import DispatchDocumentFinalization from "./DispatchDocumentFinalization";
import CustomerDeliveryOrderModal from "./CustomerDeliveryOrderModal";

import type {
  DispatchFinalizationRow,
  DispatchTeam,
} from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";

interface Props {
  show: boolean;

  rows: DispatchFinalizationRow[];

  dispatchTeam: DispatchTeam;

  setDispatchTeam: React.Dispatch<
    React.SetStateAction<DispatchTeam>
  >;

  onClose: () => void;

  onFinalize: (
    row: DispatchFinalizationRow,
  ) => void;

  onEdit: (
    deliverySheetId: number,
  ) => void;
}

const DispatchFinalizationModal = ({
  show,
  rows,
  dispatchTeam,
  setDispatchTeam,
  onClose,
  onFinalize,
  onEdit,
}: Props) => {
  const modal =
    useDispatchFinalizationModal(
      rows,
    );

  // ==========================================
  // DOCUMENT FINALIZATION
  // ==========================================

  const [
    showDocumentModal,
    setShowDocumentModal,
  ] = useState(false);

  const [selectedRow, setSelectedRow] =
    useState<DispatchFinalizationRow | null>(
      null,
    );

  const [processing, setProcessing] =
    useState(false);

  // ==========================================
  // EDIT
  // ==========================================

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    editDeliverySheet,
    setEditDeliverySheet,
  ] = useState<any>(null);

  const [
    loadingEdit,
    setLoadingEdit,
  ] = useState(false);

  // ==========================================
  // GROUP ROWS
  // ==========================================

  const groupedRows =
    modal.dispatchRows.reduce(
      (
        acc,
        item,
      ) => {
        if (!acc[item.vehicle]) {
          acc[item.vehicle] = [];
        }

        acc[item.vehicle].push(
          item,
        );

        return acc;
      },
      {} as Record<
        string,
        DispatchFinalizationRow[]
      >,
    );

  // ==========================================
  // FINALIZE
  // ==========================================

  const handleProcess =
    async () => {
      if (!selectedRow) {
        alert(
          "Please select a delivery sheet",
        );

        return;
      }

      const deliverySheetId =
        selectedRow.id;

      try {
        setProcessing(true);

        const response =
          await dispatchServiceApi.dispatchDeliverySheet(
            deliverySheetId,
          );

        console.log(
          "Dispatch Finalization Response:",
          response.data,
        );

        if (
          !response.data?.success
        ) {
          alert(
            response.data?.error ||
              "Failed to finalize dispatch",
          );

          return;
        }

        alert(
          "Dispatch finalized successfully",
        );

        onFinalize({
          ...selectedRow,

          status: "Finalized",
        });

        setShowDocumentModal(false);

        setSelectedRow(null);
      } catch (error) {
        console.error(
          "Error finalizing dispatch:",
          error,
        );

        alert(
          "Failed to finalize dispatch",
        );
      } finally {
        setProcessing(false);
      }
    };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = async (
    deliverySheetId: number,
  ) => {
    try {
      setLoadingEdit(true);

      console.log(
        "========================================",
      );

      console.log(
        "EDIT DELIVERY SHEET ID:",
        deliverySheetId,
      );

      console.log(
        "========================================",
      );

      const response =
        await dispatchServiceApi.getDeliverySheetById(
          deliverySheetId,
        );

      console.log(
        "EDIT DELIVERY SHEET RESPONSE:",
        response.data,
      );

      if (
        !response.data?.success
      ) {
        alert(
          response.data?.error ||
            "Failed to load delivery sheet",
        );

        return;
      }

      const sheet =
        response.data.data;

      console.log(
        "EDIT SHEET:",
        sheet,
      );

      // ==========================================
      // SET EDIT DATA
      // ==========================================

      setEditDeliverySheet(
        sheet,
      );

      // ==========================================
      // IMPORTANT:
      // SET PARENT DISPATCH TEAM
      // ==========================================

      setDispatchTeam({
        salesRep:
          sheet.salesRep ?? "",

        courierName:
          sheet.courierName ?? "",

        regNo:
          sheet.vehicleRegNo ?? "",

        driverName:
          sheet.driverName ?? "",

        driverId:
          Number(
            sheet.driverId ?? 0,
          ),

        driverIdNo:
          sheet.driverIdNo ?? "",

        courierServiceId:
          Number(
            sheet.courierServiceId ??
              0,
          ),
      });

      console.log(
        "DISPATCH TEAM SET FOR EDIT:",
        {
          courierName:
            sheet.courierName,

          courierServiceId:
            sheet.courierServiceId,

          driverId:
            sheet.driverId,

          driverName:
            sheet.driverName,

          driverIdNo:
            sheet.driverIdNo,
        },
      );

      // ==========================================
      // OPEN EDIT MODAL
      // ==========================================

      setShowEditModal(
        true,
      );
    } catch (error) {
      console.error(
        "Error loading delivery sheet:",
        error,
      );

      alert(
        "Failed to load delivery sheet",
      );
    } finally {
      setLoadingEdit(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
      {/* ==========================================
          FINALIZATION MODAL
      ========================================== */}

      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title text-white">
                🚚 Dispatch Initialisation
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={
                  onClose
                }
              />
            </div>

            <div className="modal-body">
              <div className="table-responsive">

                <table className="table table-bordered">

                  <thead>
                    <tr className="bg-new">
                      <th>
                        Dispatch Date
                      </th>

                      <th>
                        Delivery Order No
                      </th>

                      <th>
                        Sales Rep
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Courier
                      </th>

                      <th>
                        Driver
                      </th>

                      <th>
                        Zone
                      </th>

                      <th>
                        Review
                      </th>

                      <th>
                        Print
                      </th>

                      <th>
                        Finalize
                      </th>

                      <th>
                        Edit
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(
                      groupedRows,
                    ).map(
                      ([
                        vehicle,
                        vehicleRows,
                      ]) => (
                        <>
                          <tr
                            key={`vehicle-${vehicle}`}
                            className="table-secondary"
                          >
                            <td colSpan={11}>
                              <b>
                                Vehicle Reg No :{" "}
                                {
                                  vehicle
                                }
                              </b>
                            </td>
                          </tr>

                          {vehicleRows.map(
                            (
                              row,
                            ) => (
                              <tr
                                key={
                                  row.id
                                }
                              >
                                <td>
                                  {
                                    row.date
                                  }
                                </td>

                                <td>
                                  {
                                    row.deliveryNo
                                  }
                                </td>

                                <td>
                                  {
                                    row.salesRep
                                  }
                                </td>

                                <td>
                                  {
                                    row.customerName
                                  }
                                </td>

                                <td>
                                  {
                                    row.courierName
                                  }
                                </td>

                                <td>
                                  {
                                    row.driverName
                                  }
                                </td>

                                <td>
                                  {
                                    row.zone
                                  }
                                </td>

                                {/* REVIEW */}

                                <td>
                                  <button
                                    className="btn btn-info btn-sm"
                                    onClick={() =>
                                      modal.handleReview(
                                        row,
                                      )
                                    }
                                  >
                                    🔍
                                  </button>
                                </td>

                                {/* PRINT */}

                                <td>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() =>
                                      modal.handlePrint(
                                        row,
                                      )
                                    }
                                  >
                                    🖨
                                  </button>
                                </td>

                                {/* FINALIZE */}

                                <td>
                                  <button
                                    className="btn btn-success btn-sm"
                                    disabled={
                                      row.status ===
                                      "Finalized"
                                    }
                                    onClick={() => {
                                      setSelectedRow(
                                        row,
                                      );

                                      setShowDocumentModal(
                                        true,
                                      );
                                    }}
                                  >
                                    {row.status ===
                                    "Finalized"
                                      ? "✔"
                                      : "📦"}
                                  </button>
                                </td>

                                {/* EDIT */}

                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    disabled={
                                      loadingEdit
                                    }
                                    onClick={() =>
                                      handleEdit(
                                        row.id,
                                      )
                                    }
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </td>
                              </tr>
                            ),
                          )}
                        </>
                      ),
                    )}
                  </tbody>

                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={
                  onClose
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>

      {/* ==========================================
          FINALIZATION DOCUMENT
      ========================================== */}

      <DispatchDocumentFinalization
        show={
          showDocumentModal
        }
        deliverySheetId={
          selectedRow?.id ??
          null
        }
        onClose={() => {
          if (processing) {
            return;
          }

          setShowDocumentModal(
            false,
          );

          setSelectedRow(null);
        }}
        onProcess={
          handleProcess
        }
      />

      {/* ==========================================
          EDIT CUSTOMER DELIVERY
      ========================================== */}

      <CustomerDeliveryOrderModal
        show={showEditModal}

        dispatchTeam={
          dispatchTeam
        }

        setDispatchTeam={
          setDispatchTeam
        }

        isInternal={
          Number(
            editDeliverySheet?.courierType,
          ) === 2
        }

        editDeliverySheet={
          editDeliverySheet
        }

        onClose={() => {
          setShowEditModal(
            false,
          );

          setEditDeliverySheet(
            null,
          );

          // Reset parent dispatch state

          setDispatchTeam({
            salesRep: "",
            courierName: "",
            regNo: "",
            driverName: "",
            driverId: 0,
            driverIdNo: "",
            courierServiceId: 0,
          });
        }}

        onSave={(data) => {
          console.log(
            "EDIT UPDATE SUCCESS:",
            data,
          );

          // Close edit modal

          setShowEditModal(
            false,
          );

          setEditDeliverySheet(
            null,
          );
        }}
      />
    </>
  );
};

export default DispatchFinalizationModal;