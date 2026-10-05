import { apiRequest } from "../../../shared/services/apiClient";

import type {
  Customer,
  CustomerSearchApiResponse,
  CustomerSearchRequest,
  SaveCustomerResponse,
} from "../types/customerSearch.type";

const customerSearchService = {
  // ==========================================
  // SEARCH CUSTOMERS
  // ==========================================

  searchCustomers: async (
    payload: CustomerSearchRequest,
  ): Promise<Customer[]> => {
    const params = new URLSearchParams();

    // SAP Number
    if (payload.sapNumber.trim()) {
      params.append(
        "sapNumber",
        payload.sapNumber.trim(),
      );
    }

    // Customer Name
    if (payload.customerName.trim()) {
      params.append(
        "customerName",
        payload.customerName.trim(),
      );
    }

    const queryString = params.toString();

    if (!queryString) {
      throw new Error(
        "At least one search parameter is required.",
      );
    }

    const response =
      await apiRequest<CustomerSearchApiResponse>(
        `/customers/search?${queryString}`,
        {
          method: "GET",
        },
      );

    console.log(
      "Customer Search API Response:",
      response,
    );

    // ==========================================
    // API ERROR
    // ==========================================

    if (!response.success) {
      throw new Error(
        response.error?.message ??
          "Unable to retrieve customer information.",
      );
    }

    // ==========================================
    // NO RESULTS
    // ==========================================

    if (
      !response.data ||
      !Array.isArray(response.data.customers)
    ) {
      return [];
    }

    return response.data.customers;
  },

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  saveCustomer: async (
    customer: Customer,
  ): Promise<SaveCustomerResponse> => {
    /*
     * Save Customer API has not been provided yet.
     *
     * Keep dummy implementation temporarily.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    return {
      success: true,
      message: "Customer saved successfully.",
      data: customer,
    };
  },
};

export default customerSearchService;