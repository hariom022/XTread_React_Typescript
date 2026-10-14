import { useState } from "react";
import addCasingService from "../services/addCasingService";
import { getApiErrorMessage } from "../utils/getCustomerApprovalErrorMessage";

export const useAddCasingToExistingOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCasing = async (
    orderNumber: string,
    payload: unknown,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await addCasingService.addCasing(
        orderNumber,
        payload,
      );

      return response.data;
    } catch (error: unknown) {
      console.error("Failed to add casing:", error);

      const message = getApiErrorMessage(
        error,
        "Unable to add this casing. Please check the details and try again.",
      );

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    submitCasing,
  };
};