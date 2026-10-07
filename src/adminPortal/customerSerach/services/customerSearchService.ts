import { apiRequest } from "../../../shared/services/apiClient";

import type {
  Customer,
  CustomerSearchApiResponse,
  CustomerSearchRequest,
  SyncApiResponse,
  SyncCustomersRequest,
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

  // ==========================================
  // SAVE / SYNC CUSTOMER
  // ==========================================

  saveCustomer: async (
    customer: Customer,
  ): Promise<SyncApiResponse> => {
    const payload: SyncCustomersRequest = {
      batchId: `CUSTOMER-${Date.now()}`,
      sourceSystem: "Customer Portal",
      syncTimestamp: new Date().toISOString(),

      customers: [
        {
          customerNumber: customer.customerNumber,
          customerName: customer.customerName,
          searchTerm: customer.searchTerm,
          companyCode: customer.companyCode,
          salesGroup: customer.salesGroup,
          salesGroupDescription: customer.salesGroupDescription,
          customerGroup: customer.customerGroup,
          customerGroupDescription:
            customer.customerGroupDescription,
          mobileNumber: customer.mobileNumber,
          priceList: customer.priceList,
          priceListDescription:
            customer.priceListDescription,
          address1: customer.address1,
          address2: customer.address2,
          city: customer.city,
          country: customer.country,
          pincode: customer.pincode,
          email: customer.email,
        },
      ],
    };

    console.log("Sync Customer Request:", payload);

    const response = await apiRequest<SyncApiResponse>(
      "/customers/sync",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    console.log("Sync Customer API Response:", response);

    if (!response) {
      throw new Error("Unable to sync customer.");
    }

    return response;
  },
};

export default customerSearchService;