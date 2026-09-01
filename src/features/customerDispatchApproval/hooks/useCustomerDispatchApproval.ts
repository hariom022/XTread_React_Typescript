import {
  useCallback,
  useEffect,
  useState,
} from "react";

import customerDispatchApprovalServiceApi from "../services/customerDispatchApprovalServiceApi";

import type {
  CustomerApprovalRequest,
  CustomerDispatchApprovalData,
} from "../types/customerDispatchApproval.type";

const useCustomerDispatchApproval = (
  orderNo?: string
) => {
  const [data, setData] =
    useState<CustomerDispatchApprovalData | null>(
      null
    );

  const [loading, setLoading] =
    useState<boolean>(true);

  const [approving, setApproving] =
    useState<boolean>(false);

  const [customerRepresentative, setCustomerRepresentative] =
    useState<string>("");

  const [mobileNumber, setMobileNumber] =
    useState<string>("256771454408");

  const [emailAddress, setEmailAddress] =
    useState<string>("");

  const [condition, setCondition] =
    useState<string>(
      "Received in Good Condition"
    );

  const [remarks, setRemarks] =
    useState<string>("");

  const [signature, setSignature] =
    useState<string>("");

  const [message, setMessage] =
    useState<string>("");

  const loadApprovalData =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await customerDispatchApprovalServiceApi.getCustomerApproval(
            orderNo
          );

        setData(response);
      } catch (error) {
        console.error(
          "Error loading customer approval:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, [orderNo]);

  useEffect(() => {
    loadApprovalData();
  }, [loadApprovalData]);

  const approveCustomer = async () => {
    if (!customerRepresentative.trim()) {
      setMessage(
        "Please enter customer representative name."
      );

      return;
    }

    if (!signature) {
      setMessage(
        "Please provide customer signature."
      );

      return;
    }

    if (!data) {
      return;
    }

    try {
      setApproving(true);
      setMessage("");

      const request: CustomerApprovalRequest = {
        orderNo: data.orderNo,
        customerRepresentative:
          customerRepresentative,
        mobileNumber: mobileNumber,
        emailAddress: emailAddress,
        condition: condition,
        remarks: remarks,
        signature: signature,
      };

      const response =
        await customerDispatchApprovalServiceApi.approveCustomer(
          request
        );

      setMessage(response.message);

      console.log(
        "Customer approval response:",
        response
      );
    } catch (error) {
      console.error(
        "Error approving customer order:",
        error
      );

      setMessage(
        "Something went wrong while approving the order."
      );
    } finally {
      setApproving(false);
    }
  };

  return {
    data,

    loading,

    approving,

    customerRepresentative,
    setCustomerRepresentative,

    mobileNumber,
    setMobileNumber,

    emailAddress,
    setEmailAddress,

    condition,
    setCondition,

    remarks,
    setRemarks,

    signature,
    setSignature,

    message,

    approveCustomer,
  };
};

export default useCustomerDispatchApproval;