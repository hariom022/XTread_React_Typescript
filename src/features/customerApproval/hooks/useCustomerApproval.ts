import { useEffect, useState } from "react";

import type { OrderItem } from "../types/customerApprovalList.type";

import customerApprovalService from "../services/customerApprovalService";

import { getApiErrorMessage } from "../utils/getCustomerApprovalErrorMessage";

export const useCustomerApproval = () => {
  const [approvalList, setApprovalList] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  // CUSTOMER FILTER
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  // DATE FILTER
  const [selectedDate, setSelectedDate] = useState("");

  // LOAD ORDER LIST
  const loadOrderList = async () => {
    try {
      setLoading(true);

      const res =
        await customerApprovalService.getCollectionOrders();

      console.log("API DATA", res.data.data);

      setApprovalList(res.data.data || []);
    } catch (error: unknown) {
      console.error("Load Approval Error:", error);

      alert(
        getApiErrorMessage(
          error,
          "Unable to load Customer Approval orders. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECT PLACE
  useEffect(() => {
    loadOrderList();
  }, []);

  return {
    approvalList,

    setApprovalList,

    loading,

    loadOrderList,

    selectedCustomer,
    setSelectedCustomer,

    selectedDate,
    setSelectedDate,
  };
};