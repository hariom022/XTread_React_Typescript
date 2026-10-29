import { useEffect, useMemo, useState } from "react";
import { RingLoader } from "react-spinners";

import HoldTyreIndexPage from "../components/holdTyreIndexPage";
import PreBuffingPatternApprovalModal from "../components/preBuffingPatternApprovalModal";
import NailInspectionHoldIndex from "../components/NailInspectionHoldIndex";
import NailInspectionHoldDetails from "../components/NailInspectionHoldDetails";

import { usePreBuffingIndexPage } from "../hooks/usePreBuffingIndexPage";
import { useNailInspectionHold } from "../hooks/useNailInspectionHold";

import type { NailInspectionHoldOrder } from "../types/nailInspectionHold.types";

type HoldTab = "nail" | "buffing";

const TyreOnHold = () => {
  const [activeTab, setActiveTab] = useState<HoldTab>("nail");

  const [selectedBuffingItem, setSelectedBuffingItem] = useState<any>(null);

  const [showBuffingModal, setShowBuffingModal] = useState(false);
  const [nailSearch, setNailSearch] = useState("");

  // Existing Pre-Buffing functionality: keep its hook and API.
  const {
    loading: buffingLoading,
    search: buffingSearch,
    setSearch: setBuffingSearch,
    filteredHoldTyres: buffingHoldTyres,
    loadHoldTyres: loadBuffingHoldTyres,
  } = usePreBuffingIndexPage("buffing");

  // New order-level Nail Inspection functionality.
  const {
    orders,
    selectedOrder,
    loading: nailLoading,
    detailsLoading,
    actionLoading,
    error: nailError,
    loadOrders,
    inspectOrder,
    closeDetails,
    submitAction,
  } = useNailInspectionHold();

  useEffect(() => {
    if (activeTab === "nail") {
      void loadOrders();
    } else {
      void loadBuffingHoldTyres();
    }
  }, [activeTab, loadOrders, loadBuffingHoldTyres]);

  const filteredNailOrders = useMemo(() => {
    const searchText = nailSearch.trim().toLowerCase();

    if (!searchText) {
      return orders;
    }

    return orders.filter((order) =>
      [
        order.orderNumber,
        order.customerName,
        order.holdType,
        order.requiresLpo ? "LPO Required" : "",
        order.requiresPayment ? "Payment Required" : "",
        ...(order.casings ?? []).flatMap((casing) => [
          casing.tyreReferenceNumber,
          casing.productionNumber,
          casing.tyreSizeLabel,
          casing.tyreMakeName,
          casing.serviceTypeName,
        ]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchText),
    );
  }, [orders, nailSearch]);

  const handleInspectNailOrder = (order: NailInspectionHoldOrder) => {
    void inspectOrder(order);
  };

  // Handler for LPO Received / Payment Received at nail inspection level
  const handleCommercialConfirmation = async (
    action: "LPO_RECEIVED" | "PAYMENT_RECEIVED",
    referenceNumber: string,
  ) => {
    const message =
      action === "LPO_RECEIVED"
        ? "Confirm that the LPO has been received for this order?"
        : "Confirm that payment has been received for this order?";

    if (!window.confirm(message)) {
      return;
    }

    await submitAction(action, referenceNumber);
  };

  // Handler for Reject Order at nail inspection level
  const handleRejectOrder = async (
    rejectionReasonId: number,
  ) => {
    if (!window.confirm("Are you sure you want to reject this order?")) {
      return;
    }

    await submitAction("REJECT_ORDER", rejectionReasonId);
  };

  const handleBuffingInspect = (item: any) => {
    setSelectedBuffingItem(item);
    setShowBuffingModal(true);
  };

  const closeBuffingModal = () => {
    setShowBuffingModal(false);
    setSelectedBuffingItem(null);
  };

  return (
    <div className="container-fluid mt-3">
      {/* Only the two required tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "nail" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("nail");
              setNailSearch("");
            }}
          >
            Nail Inspection Hold
          </button>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "buffing" ? "active" : ""}`}
            onClick={() => setActiveTab("buffing")}
          >
            Pre-Buffing Hold
          </button>
        </li>
      </ul>

      {/* Nail Inspection Hold */}
      {activeTab === "nail" && (
        <>
          {selectedOrder ? (
            <NailInspectionHoldDetails
              order={selectedOrder}
              loading={detailsLoading}
              actionLoading={actionLoading}
              error={nailError}
              onBack={closeDetails}
              onAction={(action, value) => {
                if (action === "REJECT_ORDER") {
                  if (typeof value === "number") {
                    void handleRejectOrder(value);
                  }
                  return;
                }

                if (
                  (action === "LPO_RECEIVED" || action === "PAYMENT_RECEIVED") &&
                  typeof value === "string"
                ) {
                  void handleCommercialConfirmation(action, value);
                }
              }}
            />
          ) : detailsLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 300 }}
            >
              <RingLoader size={70} />
            </div>
          ) : (
            <>
              {nailError && !selectedOrder && (
                <div className="alert alert-warning" role="alert">
                  {nailError}
                </div>
              )}

              <div className="row mb-3">
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Order No., Customer, Service or Requirement..."
                    value={nailSearch}
                    onChange={(event) => setNailSearch(event.target.value)}
                  />
                </div>

                <div className="col-md-2 mt-2 mt-md-0">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => void loadOrders()}
                    disabled={nailLoading}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {nailLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: 300 }}
                >
                  <RingLoader size={70} />
                </div>
              ) : (
                <NailInspectionHoldIndex
                  data={filteredNailOrders}
                  onInspect={handleInspectNailOrder}
                />
              )}

              {selectedOrder && (
                <NailInspectionHoldDetails
                  order={selectedOrder}
                  loading={detailsLoading}
                  actionLoading={actionLoading}
                  error={nailError}
                  onBack={closeDetails}
                  onAction={(action, value) => {
                    if (action === "REJECT_ORDER") {
                      if (typeof value === "number") {
                        void handleRejectOrder(value);
                      }
                      return;
                    }

                    if (
                      (action === "LPO_RECEIVED" || action === "PAYMENT_RECEIVED") &&
                      typeof value === "string"
                    ) {
                      void handleCommercialConfirmation(action, value);
                    }
                  }}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Existing Pre-Buffing Hold: preserve its index and modal */}
      {activeTab === "buffing" && (
        <>
          <div className="row mb-3">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
                value={buffingSearch}
                onChange={(event) => setBuffingSearch(event.target.value)}
              />
            </div>
          </div>

          {buffingLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 300 }}
            >
              <RingLoader size={70} />
            </div>
          ) : (
            <HoldTyreIndexPage
              data={buffingHoldTyres}
              onInspect={handleBuffingInspect}
            />
          )}

          {showBuffingModal && selectedBuffingItem && (
            <PreBuffingPatternApprovalModal
              selectedItem={selectedBuffingItem}
              onClose={closeBuffingModal}
              onApproved={loadBuffingHoldTyres}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TyreOnHold;
