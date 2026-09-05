import { useMemo, useState } from "react";

import { RingLoader } from "react-spinners";

import DispatchIndexTable from "../components/DispatchIndexTable";
import useDispatchIndexTable from "../hooks/useDispatchIndexTable";
import DispatchTeamModal from "../components/DispatchTeamModal";
import ProductionSuccessModal from "../components/ProductionSuccessModal";
import CustomerDeliveryOrderModal from "../components/CustomerDeliveryOrderModal";
import DispatchDetailsModal from "../components/DispatchDetailsModal";
import DispatchFinalizationModal from "../components/DispatchFinallizationModal";

import type {
  DispatchTeam,
  ProductionSuccessData,
  CustomerDeliveryPayload,
  DispatchFinalizationRow,
} from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";

const DispatchStage = () => {
  const { rows, loading } = useDispatchIndexTable();

  const [search, setSearch] = useState("");

  // ==========================================
  // CREATE DELIVERY SHEET
  // ==========================================

  const [showDispatchTeamModal, setShowDispatchTeamModal] =
    useState(false);

  const [showCustomerDeliveryModal, setShowCustomerDeliveryModal] =
    useState(false);

  // ==========================================
  // FINALIZATION
  // ==========================================

  const [showFinalizationModal, setShowFinalizationModal] =
    useState(false);

  const [finalDispatchList, setFinalDispatchList] = useState<
    DispatchFinalizationRow[]
  >([]);

  const [dispatchIndexRows, setDispatchIndexRows] = useState<
    DispatchFinalizationRow[]
  >([]);

  // ==========================================
  // PRODUCTION
  // ==========================================

  const [showProductionModal, setShowProductionModal] =
    useState(false);

  const [productionData, setProductionData] =
    useState<ProductionSuccessData | null>(null);

  // ==========================================
  // DISPATCH DETAILS
  // ==========================================

  const [showDispatchDetails, setShowDispatchDetails] =
    useState(false);

  const [selectedDeliverySheetId, setSelectedDeliverySheetId] =
    useState<number | null>(null);

  // ==========================================
  // DELIVERY SHEETS LOADING
  // ==========================================

  const [loadingDeliverySheets, setLoadingDeliverySheets] =
    useState(false);

  // ==========================================
  // DISPATCH TEAM
  // ==========================================

  const [dispatchTeam, setDispatchTeam] =
    useState<DispatchTeam>({
      salesRep: "",
      courierName: "",
      regNo: "",
      driverName: "",
      driverId: 0,
      driverIdNo: "",
      courierServiceId: 0,
    });

  const [isInternal, setIsInternal] =
    useState(false);

  // ==========================================
  // EDIT DELIVERY SHEET
  // ==========================================

  const [showEditDeliveryModal, setShowEditDeliveryModal] =
    useState(false);

  const [editDeliverySheet, setEditDeliverySheet] =
    useState<any>(null);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredData = useMemo(() => {
    return rows.filter((item) =>
      `${item.deliveryNo}
       ${item.customerName}
       ${item.salesRep}
       ${item.courierName}
       ${item.driverName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [rows, search]);

  // ==========================================
  // LOAD DELIVERY SHEETS
  // ==========================================

  const loadDeliverySheets = async () => {
    try {
      setLoadingDeliverySheets(true);

      console.log("Getting Delivery Sheets...");

      const response =
        await dispatchServiceApi.getDeliverySheets();

      console.log(
        "Delivery Sheets API Response:",
        response.data,
      );

      if (!response.data?.success) {
        console.error(
          "Delivery Sheets API failed:",
          response.data?.error,
        );

        setFinalDispatchList([]);

        return;
      }

      const deliverySheets = Array.isArray(
        response.data.data,
      )
        ? response.data.data
        : [];

      // ==========================================
      // MAP API RESPONSE
      // ==========================================

      const mappedRows: DispatchFinalizationRow[] =
        deliverySheets.map((item: any) => ({
          id: item.deliverySheetId,

          date: item.createdAtUtc
            ? new Date(
                item.createdAtUtc,
              ).toLocaleDateString("en-GB")
            : "",

          deliveryNo:
            item.deliverySheetNumber ?? "",

          salesRep: "",

          customerName: "",

          courierName:
            item.courierName ?? "",

          driverName:
            item.driverName ?? "",

          zone: "",

          vehicle:
            item.vehicleRegNo ?? "",

          status: "Pending",

          casings: [],
        }));

      console.log(
        "Mapped Delivery Sheets:",
        mappedRows,
      );

      setFinalDispatchList(mappedRows);

      setShowFinalizationModal(true);
    } catch (error) {
      console.error(
        "Error fetching delivery sheets:",
        error,
      );

      alert("Failed to load delivery sheets");
    } finally {
      setLoadingDeliverySheets(false);
    }
  };

  // ==========================================
  // EDIT DELIVERY SHEET
  //
  // NOTE:
  // DispatchFinalizationModal currently handles
  // the actual edit API call.
  //
  // This function is kept if you want to trigger
  // edit from parent in future.
  // ==========================================

  const handleEditDeliverySheet = async (
    deliverySheetId: number,
  ) => {
    try {
      console.log(
        "Getting Delivery Sheet:",
        deliverySheetId,
      );

      const response =
        await dispatchServiceApi.getDeliverySheetById(
          deliverySheetId,
        );

      console.log(
        "Delivery Sheet Details:",
        response.data,
      );

      if (!response.data?.success) {
        alert(
          response.data?.error ||
            "Failed to load delivery sheet",
        );

        return;
      }

      const sheet = response.data.data;

      console.log(
        "EDIT SHEET FROM PARENT:",
        sheet,
      );

      setEditDeliverySheet(sheet);

      // ==========================================
      // SET DISPATCH TEAM
      // ==========================================

      setDispatchTeam({
        salesRep: "",

        courierName:
          sheet.courierName ?? "",

        regNo:
          sheet.vehicleRegNo ?? "",

        driverName:
          sheet.driverName ?? "",

        driverId:
          Number(sheet.driverId ?? 0),

        driverIdNo:
          sheet.driverIdNo ?? "",

        courierServiceId:
          Number(sheet.courierServiceId ?? 0),
      });

      setIsInternal(
        Number(sheet.courierType) === 2,
      );

      setShowEditDeliveryModal(true);
    } catch (error) {
      console.error(
        "Error loading delivery sheet:",
        error,
      );

      alert("Failed to load delivery sheet");
    }
  };

  return (
    <div className="container-fluid box mt-3">
      <div className="col">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="d-flex justify-content-between"
          style={{
            alignItems: "center",
          }}
        >
          {/* CREATE */}

          <button
            className="btn btn-primary p-4 mt-1"
            onClick={() =>
              setShowDispatchTeamModal(true)
            }
          >
            <h4>Create Delivery Sheet</h4>
          </button>

          {/* TITLE */}

          <div
            className="d-flex justify-content-center p-2"
            style={{
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h1>
              <b>Dispatch Stage</b>
            </h1>
          </div>

          {/* INITIALISATION */}

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success p-3"
              onClick={loadDeliverySheets}
              disabled={loadingDeliverySheets}
            >
              <h3>
                {loadingDeliverySheets
                  ? "Loading..."
                  : "🚚 Dispatch Initialisation"}
              </h3>
            </button>
          </div>
        </div>

        <hr />

        {/* ==========================================
            MAIN DISPATCH TABLE
        ========================================== */}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              minHeight: "300px",
            }}
          >
            <RingLoader
              color="#b30815"
              size={80}
            />
          </div>
        ) : (
          <DispatchIndexTable
            data={
              filteredData.length > 0
                ? filteredData
                : rows
            }
            onDetails={(deliverySheetId) => {
              console.log(
                "Selected Delivery Sheet ID:",
                deliverySheetId,
              );

              setSelectedDeliverySheetId(
                deliverySheetId,
              );

              setShowDispatchDetails(true);
            }}
          />
        )}

        {/* ==========================================
            DISPATCH DETAILS
        ========================================== */}

        <DispatchDetailsModal
          show={showDispatchDetails}
          deliverySheetId={selectedDeliverySheetId}
          onClose={() => {
            setShowDispatchDetails(false);

            setSelectedDeliverySheetId(null);
          }}
        />
      </div>

      {/* ==========================================
          CREATE - DISPATCH TEAM
      ========================================== */}

      <DispatchTeamModal
        show={showDispatchTeamModal}
        onClose={() => {
          setShowDispatchTeamModal(false);
        }}
        setDispatchTeam={setDispatchTeam}
        setIsInternal={setIsInternal}
        onContinue={() => {
          setShowDispatchTeamModal(false);

          setShowCustomerDeliveryModal(true);
        }}
      />

      {/* ==========================================
          CREATE - CUSTOMER DELIVERY ORDER
      ========================================== */}

      <CustomerDeliveryOrderModal
        show={showCustomerDeliveryModal}
        dispatchTeam={dispatchTeam}
        setDispatchTeam={setDispatchTeam}
        isInternal={isInternal}
        onClose={() =>
          setShowCustomerDeliveryModal(false)
        }
        onSave={(
          payload: CustomerDeliveryPayload,
        ) => {
          setProductionData({
            customer: payload.customer,
            deliveryNo: payload.deliveryNo,
          });

          setFinalDispatchList((prev) => [
            ...prev,
            {
              id: Date.now(),

              date: new Date().toLocaleDateString(
                "en-GB",
              ),

              deliveryNo:
                payload.deliveryNo,

              salesRep:
                dispatchTeam.salesRep,

              customerName:
                payload.customer ?? "",

              courierName:
                dispatchTeam.courierName,

              driverName:
                dispatchTeam.driverName,

              zone: "North Zone",

              vehicle:
                dispatchTeam.regNo,

              status: "Pending",

              casings: payload.casings,
            },
          ]);

          // Reset

          setDispatchTeam({
            salesRep: "",
            courierName: "",
            regNo: "",
            driverName: "",
            driverId: 0,
            driverIdNo: "",
            courierServiceId: 0,
          });

          setShowCustomerDeliveryModal(
            false,
          );

          setShowProductionModal(true);
        }}
      />

      {/* ==========================================
          PRODUCTION SUCCESS
      ========================================== */}

      <ProductionSuccessModal
        show={showProductionModal}
        data={productionData}
        onClose={() => {
          setShowProductionModal(false);

          setProductionData(null);
        }}
      />

      {/* ==========================================
          DISPATCH FINALIZATION
      ========================================== */}

      <DispatchFinalizationModal
        show={showFinalizationModal}
        rows={finalDispatchList}

        dispatchTeam={dispatchTeam}
        setDispatchTeam={setDispatchTeam}

        onClose={() =>
          setShowFinalizationModal(false)
        }

        onEdit={
          handleEditDeliverySheet
        }

        onFinalize={(row) => {
          // ==========================================
          // ADD TO MAIN TABLE
          // ==========================================

          setDispatchIndexRows((prev) => [
            ...prev,
            {
              ...row,
              status: "Finalized",
            },
          ]);

          // ==========================================
          // REMOVE FROM INITIALISATION
          // ==========================================

          setFinalDispatchList((prev) =>
            prev.filter(
              (item) =>
                item.id !== row.id,
            ),
          );
        }}
      />

      {/* ==========================================
          OPTIONAL PARENT EDIT MODAL
      ========================================== */}

      {showEditDeliveryModal && (
        <CustomerDeliveryOrderModal
          show={showEditDeliveryModal}
          dispatchTeam={dispatchTeam}
          setDispatchTeam={setDispatchTeam}
          isInternal={isInternal}
          editDeliverySheet={
            editDeliverySheet
          }
          onClose={() => {
            setShowEditDeliveryModal(false);

            setEditDeliverySheet(null);

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
        />
      )}
    </div>
  );
};

export default DispatchStage;