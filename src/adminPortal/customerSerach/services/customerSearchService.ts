import { apiRequest } from "../../../shared/services/apiClient";

import type {
  Customer,
  CustomerApiResponse,
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

    const response =
      await apiRequest<CustomerSearchApiResponse>(
        `/api/customers/search${
          queryString ? `?${queryString}` : ""
        }`,
        {
          method: "GET",
        },
      );

    if (!response.success) {
      throw new Error(
        response.error ||
          "Unable to search customers.",
      );
    }

    const customers =
      response.data?.customers ?? [];

    // Convert API response into the Customer
    // structure used by the UI.
    return customers.map(
      (
        customer: CustomerApiResponse,
        index: number,
      ) => ({
        id: index + 1,

        customerNumber:
          customer.customerNumber,

        customerName:
          customer.customerName,

        mobileNumber:
          customer.mobileNumber,

        // The API response gives customerNumber.
        // We use it for SAP Number display for now.
        sapNumber:
          customer.customerNumber,

        address1:
          customer.address1,

        address2:
          customer.address2,

        city:
          customer.city,

        country:
          customer.country,

        pincode:
          customer.pincode,

        email:
          customer.email,

        companyCode:
          customer.companyCode,

        salesGroup:
          customer.salesGroup,

        salesGroupDescription:
          customer.salesGroupDescription,

        customerGroup:
          customer.customerGroup,

        customerGroupDescription:
          customer.customerGroupDescription,

        priceList:
          customer.priceList,

        priceListDescription:
          customer.priceListDescription,
      }),
    );
  },

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  saveCustomer: async (
    customer: Customer,
  ): Promise<SaveCustomerResponse> => {
    /*
     * Save API is not provided yet.
     *
     * Keep this temporarily as a dummy implementation.
     * Replace this section when Save Customer API is available.
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