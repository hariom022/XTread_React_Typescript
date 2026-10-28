import { useCallback, useState } from "react";

import holdTyreServiceApi from "../service/holdTyreServiceApi";

import type {
  NailInspectionHoldOrder,
  NailInspectionHoldOrderDetails,
  NailInspectionHoldAction,
  NailInspectionHoldActionPayload,
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

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await holdTyreServiceApi.getNailInspectionHoldOrders();

      const result = response?.data;

      if (result?.success === false) {
        throw new Error(
          result?.error || "Unable to load Nail Inspection Hold orders.",
        );
      }

      const items = result?.data;

      if (!Array.isArray(items)) {
        throw new Error(
          "Invalid response received from Nail Inspection Hold API.",
        );
      }

      setOrders(items as NailInspectionHoldOrder[]);
    } catch (err) {
      setOrders([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const inspectOrder = useCallback(async (order: NailInspectionHoldOrder) => {
    setDetailsLoading(true);
    setError(null);

    try {
      setSelectedOrder(order);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  }, []);

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

      if (
        action === "LPO_RECEIVED" &&
        selectedOrder.commercialRequirement !== "LPO"
      ) {
        setError("LPO confirmation is not applicable to this order.");
        return;
      }

      if (
        action === "PAYMENT_RECEIVED" &&
        selectedOrder.commercialRequirement !== "PAYMENT"
      ) {
        setError("Payment confirmation is not applicable to this order.");
        return;
      }

      setActionLoading(true);
      setError(null);

      try {
        const payload: NailInspectionHoldActionPayload = {
          orderId: selectedOrder.orderId,
          action,
        };

        if (action === "LPO_RECEIVED" || action === "PAYMENT_RECEIVED") {
          await holdTyreServiceApi.approveNailInspectionHoldOrder(
            selectedOrder.orderId,
          );
        } else {
          throw new Error("The Reject Order API has not been configured yet.");
        }

        setSelectedOrder(null);
        await loadOrders();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setActionLoading(false);
      }
    },
    [selectedOrder, loadOrders],
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
