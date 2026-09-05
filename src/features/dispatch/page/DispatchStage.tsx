import { useMemo, useState } from "react";

import { RingLoader } from "react-spinners";

import DispatchIndexTable from "../components/DispatchIndexTable";

import useDispatchIndexTable from "../hooks/useDispatchIndexTable";
import DispatchTeamModal from "../components/DispatchTeamModal";
// import DispatchDetails from "../components/DispatchDetails";
import ProductionSuccessModal from "../components/ProductionSuccessModal";
import CustomerDeliveryOrderModal from "../components/CustomerDeliveryOrderModal";
import DispatchDetailsModal from "../components/DispatchDetailsModal";

import type {
  DispatchTeam,
  ProductionSuccessData,
  CustomerDeliveryPayload,
  DispatchFinalizationRow,
} from "../type/dispatch.types";
import DispatchFinalizationModal from "../components/DispatchFinallizationModal";
import dispatchServiceApi from "../service/dispatchServiceApi";

const DispatchStage = () => {
  const { rows, loading } = useDispatchIndexTable();

  const [search, setSearch] = useState("");

  const [showDispatchTeamModal, setShowDispatchTeamModal] = useState(false);

  const [showFinalizationModal, setShowFinalizationModal] = useState(false);

  const [showCustomerDeliveryModal, setShowCustomerDeliveryModal] =
    useState(false);

  const [showProductionModal, setShowProductionModal] = useState(false);

  const [finalDispatchList, setFinalDispatchList] = useState<
    DispatchFinalizationRow[]
  >([]);
  const [dispatchIndexRows, setDispatchIndexRows] = useState<
    DispatchFinalizationRow[]
  >([]);
  const [productionData, setProductionData] =
    useState<ProductionSuccessData | null>(null);

  const [showDispatchDetails, setShowDispatchDetails] = useState(false);
  const [loadingDeliverySheets, setLoadingDeliverySheets] = useState(false);

  const [selectedDeliverySheetId, setSelectedDeliverySheetId] = useState<
    number | null
  >(null);

  const [dispatchTeam, setDispatchTeam] = useState<DispatchTeam>({
    salesRep: "",
    courierName: "",
    regNo: "",
    driverName: "",
    driverId: 0,
    driverIdNo: "",
    courierServiceId: 0,
  });

  const [isInternal, setIsInternal] = useState(false);

  const [showEditDeliveryModal, setShowEditDeliveryModal] = useState(false);

  const [editDeliverySheet, setEditDeliverySheet] = useState<any>(null);

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

  const loadDeliverySheets = async () => {
    try {
      setLoadingDeliverySheets(true);

      console.log("Getting Delivery Sheets...");

      const response = await dispatchServiceApi.getDeliverySheets();

      console.log("Delivery Sheets API Response:", response.data);

      if (!response.data?.success) {
        console.error("Delivery Sheets API failed:", response.data?.error);

        setFinalDispatchList([]);

        return;
      }

      const deliverySheets = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      // ==========================================
      // MAP API RESPONSE
      // TO DispatchFinalizationRow
      // ==========================================

      const mappedRows: DispatchFinalizationRow[] = deliverySheets.map(
        (item: any) => ({
          id: item.deliverySheetId,

          date: item.createdAtUtc
            ? new Date(item.createdAtUtc).toLocaleDateString("en-GB")
            : "",

          deliveryNo: item.deliverySheetNumber ?? "",

          salesRep: "",

          customerName: "",

          courierName: item.courierName ?? "",

          driverName: item.driverName ?? "",

          zone: "",

          vehicle: item.vehicleRegNo ?? "",

          status: "Pending",

          casings: [],
        }),
      );

      console.log("Mapped Delivery Sheets:", mappedRows);

      setFinalDispatchList(mappedRows);

      setShowFinalizationModal(true);
    } catch (error) {
      console.error("Error fetching delivery sheets:", error);

      alert("Failed to load delivery sheets");
    } finally {
      setLoadingDeliverySheets(false);
    }
  };
  const handleEditDeliverySheet = async (deliverySheetId: number) => {
    try {
      console.log("✏ Getting Delivery Sheet:", deliverySheetId);

      const response =
        await dispatchServiceApi.getDeliverySheetById(deliverySheetId);

      console.log("✏ Delivery Sheet Details:", response.data);

      if (!response.data?.success) {
        alert(response.data?.error || "Failed to load delivery sheet");

        return;
      }

      const sheet = response.data.data;

      setEditDeliverySheet(sheet);

      // ==========================================
      // SET COURIER / DRIVER DETAILS
      // ==========================================

      setDispatchTeam({
        salesRep: "",

        courierName: sheet.courierName ?? "",

        regNo: sheet.vehicleRegNo ?? "",

        driverName: sheet.driverName ?? "",

        // Actual Driver table ID
        driverId: Number(sheet.driverId ?? 0),

        // Driver ID number
        driverIdNo: sheet.driverIdNo ?? "",

        courierServiceId: Number(sheet.courierServiceId ?? 0),
      });

      setShowEditDeliveryModal(true);
    } catch (error) {
      console.error("Error loading delivery sheet:", error);

      alert("Failed to load delivery sheet");
    }
  };
  return (
    <div className="container-fluid box mt-3">
      <div className="col">
        <div
          className=" d-flex justify-content-between"
          style={{ alignItems: "center" }}
        >
          <button
            className="btn btn-primary p-4 mt-1"
            onClick={() => setShowDispatchTeamModal(true)}
          >
            <h4>Create Delivery Sheet</h4>
          </button>

          <div
            className="d-flex justify-content-center p-2 "
            style={{
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h1>
              {" "}
              <b>Dispatch Stage </b>
            </h1>
          </div>
          {/* Dispatch Initiallisation */}
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

        {/* TABLE */}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              minHeight: "300px",
            }}
          >
            <RingLoader color="#b30815" size={80} />
          </div>
        ) : (
          <DispatchIndexTable
            data={rows}
            onDetails={(deliverySheetId) => {
              console.log("Selected Delivery Sheet ID:", deliverySheetId);

              setSelectedDeliverySheetId(deliverySheetId);

              setShowDispatchDetails(true);
            }}
          />
        )}
        <DispatchDetailsModal
          show={showDispatchDetails}
          deliverySheetId={selectedDeliverySheetId}
          onClose={() => {
            setShowDispatchDetails(false);

            setSelectedDeliverySheetId(null);
          }}
        />
      </div>
      {/* NEXT STEP */}
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

      <CustomerDeliveryOrderModal
        show={showCustomerDeliveryModal}
        dispatchTeam={dispatchTeam}
        setDispatchTeam={setDispatchTeam}
        isInternal={isInternal}
        onClose={() => setShowCustomerDeliveryModal(false)}
        onSave={(payload: CustomerDeliveryPayload) => {
          setProductionData({
            customer: payload.customer,
            deliveryNo: payload.deliveryNo,
          });
          setDispatchTeam({
            salesRep: "",
            courierName: "",
            regNo: "",
            driverName: "",
            driverId: 0,
            driverIdNo: "",
            courierServiceId: 0,
          });
          setFinalDispatchList((prev) => [
            ...prev,
            {
              id: Date.now(),

              date: new Date().toLocaleDateString("en-GB"),

              deliveryNo: payload.deliveryNo,

              salesRep: dispatchTeam.salesRep,

              customerName: payload.customer ?? "",

              courierName: dispatchTeam.courierName,

              driverName: dispatchTeam.driverName,

              zone: "North Zone",

              vehicle: dispatchTeam.regNo,

              status: "Pending",

              casings: payload.casings,
            },
          ]);

          setShowCustomerDeliveryModal(false);

          setShowProductionModal(true);
        }}
      />

      <ProductionSuccessModal
        show={showProductionModal}
        data={productionData}
        onClose={() => {
          setShowProductionModal(false);

          setProductionData(null);
        }}
      />

      {/* Dispatch Finalization Modal */}

      <DispatchFinalizationModal
        show={showFinalizationModal}
        rows={finalDispatchList}
        dispatchTeam={dispatchTeam}
        setDispatchTeam={setDispatchTeam}
        onClose={() => setShowFinalizationModal(false)}
        onEdit={handleEditDeliverySheet}
        onFinalize={(row) => {
          // Add to main Dispatch table
          setDispatchIndexRows((prev) => [
            ...prev,
            {
              ...row,
              status: "Finalized",
            },
          ]);

          // Remove from Dispatch Initialisation
          setFinalDispatchList((prev) =>
            prev.filter((item) => item.id !== row.id),
          );
        }}
      />
    </div>
  );
};

export default DispatchStage;
