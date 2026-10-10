import { useState } from "react";
import addCasingService from "../services/addCasingService";

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

      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            title?: string;
          };
        };
        message?: string;
      };

      const message =
        apiError.response?.data?.message ??
        apiError.response?.data?.title ??
        apiError.message ??
        "Failed to add casing. Please try again.";

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