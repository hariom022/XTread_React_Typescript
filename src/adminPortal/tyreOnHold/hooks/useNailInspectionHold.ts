import { useCallback, useState } from "react";

import holdTyreServiceApi from "../service/holdTyreServiceApi";

import type {
  NailInspectionHoldOrder,
  NailInspectionHoldOrderDetails,
  NailInspectionHoldAction,
} from "../types/nailInspectionHold.types";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to process the Nail Inspection Hold request.";
};

const useNailInspectionHold = () => {
  const [orders, setOrders] = useState<NailInspectionHoldOrder[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<NailInspectionHoldOrderDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load orders and casings from the pending-orders API.
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await holdTyreServiceApi.getNailInspectionHoldOrders();

      const result = response.data;

      if (result?.success !== true || !Array.isArray(result.data)) {
        throw new Error(
          result?.error ||
            "Invalid response received from Nail Inspection Hold API."
        );
      }

      setOrders(result.data as NailInspectionHoldOrder[]);
    } catch (err) {
      setOrders([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Casings are already included in the index API response.
  const inspectOrder = useCallback(
    async (order: NailInspectionHoldOrder) => {
      setDetailsLoading(true);
      setError(null);

      try {
        setSelectedOrder({
          ...order,
          casings: order.casings ?? [],
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setDetailsLoading(false);
      }
    },
    []
  );

  const closeDetails = useCallback(() => {
    setSelectedOrder(null);
    setError(null);
  }, []);

  const submitAction = useCallback(
    async (action: NailInspectionHoldAction) => {
      if (!selectedOrder) {
        setError("Please select an order first.");
        return;
      }

      if (action === "LPO_RECEIVED" && !selectedOrder.requiresLpo) {
        setError("This order does not require an LPO.");
        return;
      }

      if (
        action === "PAYMENT_RECEIVED" &&
        !selectedOrder.requiresPayment
      ) {
        setError("This order does not require payment.");
        return;
      }

      setActionLoading(true);
      setError(null);

      try {
        if (action === "REJECT_ORDER") {
          throw new Error(
            "The Reject Order API has not been provided yet."
          );
        }

        await holdTyreServiceApi.approveNailInspectionHoldOrder(
          selectedOrder.orderId
        );

        setSelectedOrder(null);
        await loadOrders();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [selectedOrder, loadOrders]
  );

  return {
    orders,
    selectedOrder,
    loading,
    detailsLoading,
    actionLoading,
    error,
    loadOrders,
    inspectOrder,
    closeDetails,
    submitAction,
  };
};

export { useNailInspectionHold };