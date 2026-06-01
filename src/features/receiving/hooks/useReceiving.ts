import { useEffect, useState, useMemo } from "react";

import receiveService from "../services/receiveService";

import type { Order, ReceivingRow } from "../types/receiving.types";

export const useReceiving = () => {
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [notReceivedLoading, setNotReceivedLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("collection");

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [selectedCasingRows, setSelectedCasingRows] = useState<string[]>([]);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([
    "all",
  ]);

  const [inspections, setInspections] = useState<ReceivingRow[]>([]);

  const [batchList, setBatchList] = useState<ReceivingRow[]>([]);

  const [casingList, setCasingList] = useState<ReceivingRow[]>([]);

  const [notReceivedList, setNotReceivedList] = useState<ReceivingRow[]>([]);

  //   const [selectedCasingRows, setSelectedCasingRows] =
  // useState<string[]>([]);

  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const transformApiData = (orders: Order[]): ReceivingRow[] => {
    const list: ReceivingRow[] = [];

    orders.forEach((order) => {
      order.casings?.forEach((casing) => {
        list.push({
          id: casing.orderCasingId,

          originalCasing: {
            ...casing,
            orderNumber: order.orderNumber,
          },

          orderNo: order.orderNumber,

          customerId: order.customer?.customerNumber || "",

          customerName: order.customer?.customerName || "",

          date: order.createdAtUtc?.split("T")[0] || "",

          tyreReferenceNumber: casing.tyreReferenceNumber || "",

          otherNumber: casing.otherNumber || "",

          dotNo: casing.dotNumber || "",

          casingSize: casing.tyreSize?.casingSize || "",

          treadPattern: casing.retreadDetail?.patternName || "",

          treadWidth: casing.retreadDetail?.width || "",

          make: casing.tyreMake?.name || "",

          model: casing.model || "",

          serviceType: casing.serviceType?.name || "",

          rimSize: casing.rimSize || "",

          tyreClassification: casing.tyreClassification?.name || "",

          existingRepairsCount: casing.existingRepairsCount || 0,

          numberOfRetreads: casing.noOfRetread ?? "-",

          previousRetreaded: casing.previousRetreader || "-",

          previousPattern: casing.previousPattern || "-",

          customerVehicleRegNo: casing.vehicleRegistrationNumber || "",

          category: casing.category || null,

          categoryName: casing.category?.categoryName || "",

          damageType:
            casing.repairDetail?.operations
              ?.map((x) => x.repairType)
              ?.join(", ") || "-",

          repairLocation:
            casing.repairDetail?.operations
              ?.map((x) => x.repairLocation)
              ?.join(", ") || "-",

          repairQty:
            casing.repairDetail?.operations
              ?.map((x) => x.quantity)
              ?.join(", ") || "-",

          remainingTreadDepth:
            casing.repairDetail?.percentageRemainingTreadDepth || "-",

          productionNo: casing.productionNumber || "",

          batchNo: casing.batchNumber || "",

          barcodeNumber: casing.barcodeNumber || "",

          comments: "",
        });
      });
    });

    return list;
  };

  // ==========================
  // COLLECTION TAB
  // ==========================
  const loadCollectionOrders = async () => {
    try {
      setCollectionLoading(true);

      const res = await receiveService.getCollectionOrders();

      const transformed = transformApiData(res.data?.data || []);

      setInspections(transformed);
    } catch (err) {
      console.error("Collection Error", err);
    } finally {
      setCollectionLoading(false);
    }
  };

  // ==========================
  // BATCH TAB
  // ==========================
  const loadBatchOrders = async () => {
    try {
      setBatchLoading(true);

      const res = await receiveService.getBatchOrders();

      const transformed = transformApiData(res.data?.data || []);

      setBatchList(transformed);
    } catch (err) {
      console.error("Batch Error", err);
    } finally {
      setBatchLoading(false);
    }
  };

  // ==========================
  // BARCODE TAB
  // ==========================
  const loadBarcodeOrders = async () => {
    try {
      setBarcodeLoading(true);

      const res = await receiveService.getBarcodeOrders();

      const transformed = transformApiData(res.data?.data || []);

      setCasingList(transformed);
    } catch (err) {
      console.error("Barcode Error", err);
    } finally {
      setBarcodeLoading(false);
    }
  };

  // ==========================
  // NOT RECEIVED
  // ==========================
  const loadNotReceivedOrders = async () => {
    try {
      setNotReceivedLoading(true);

      const res = await receiveService.getCollectionOrders({
        isReceived: false,
      });

      const transformed = transformApiData(res.data?.data || []);

      // setNotReceivedList(transformed);
    } catch (err) {
      console.error("Not Received Error", err);
    } finally {
      setNotReceivedLoading(false);
    }
  };

  // ==========================
  // REFRESH ALL
  // ==========================
  const refreshAll = async () => {
    await Promise.all([
      loadCollectionOrders(),
      loadBatchOrders(),
      loadBarcodeOrders(),
      loadNotReceivedOrders(),
    ]);
  };

  const groupedByCustomer = useMemo(() => {
    const map: Record<string, ReceivingRow[]> = {};

    inspections.forEach((item) => {
      if (!map[item.customerId]) {
        map[item.customerId] = [];
      }

      map[item.customerId].push(item);
    });

    return map;
  }, [inspections]);

  const groupedBatches = useMemo(() => {
    const map: Record<string, ReceivingRow[]> = {};

    casingList.forEach((item) => {
      const key = item.batchNo || "No Batch";

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item);
    });

    return map;
  }, [casingList]);

  const toggleBatch = (batchNo: string) => {
    setExpandedBatch((prev) => (prev === batchNo ? null : batchNo));
  };

  const toggleBatchSelection = (batchNo: string) => {
    setSelectedBatches((prev) =>
      prev.includes(batchNo)
        ? prev.filter((x) => x !== batchNo)
        : [...prev, batchNo],
    );
  };

  const toggleCasingRow = (id: number) => {
    const stringId = String(id);

    setSelectedCasingRows((prev) =>
      prev.includes(stringId)
        ? prev.filter((x) => x !== stringId)
        : [...prev, stringId],
    );
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return {
    collectionLoading,
    batchLoading,
    barcodeLoading,
    notReceivedLoading,
    activeTab,
    setActiveTab,

    selectedDate,
    setSelectedDate,

    selectedRows,
    setSelectedRows,

    selectedCustomerIds,
    setSelectedCustomerIds,

    selectedCasingRows,
    setSelectedCasingRows,

    inspections,
    setInspections,

    batchList,
    setBatchList,

    casingList,
    setCasingList,

    notReceivedList,
    setNotReceivedList,

    loadCollectionOrders,
    loadBatchOrders,
    loadBarcodeOrders,
    loadNotReceivedOrders,

    expandedBatch,
    setExpandedBatch,

    selectedBatches,
    setSelectedBatches,

    groupedByCustomer,
    groupedBatches,

    toggleBatch,
    toggleBatchSelection,
    toggleCasingRow,

    refreshAll,
  };
};
