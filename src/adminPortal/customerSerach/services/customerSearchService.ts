import type {
  Customer,
  CustomerSearchRequest,
  SaveCustomerResponse,
} from "../types/customerSearch.type";

// ============================================
// DUMMY CUSTOMER DATA
// ============================================

const dummyCustomers: Customer[] = [
  {
    id: 1,
    customerName: "Rahul Sharma",
    mobileNumber: "9876543210",
    sapNumber: "10023456",
    gpNumber: "GP-00123",
    address: "123 Park Street",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
  },
  {
    id: 2,
    customerName: "Rahul Kumar",
    mobileNumber: "9876543226",
    sapNumber: "10023457",
    gpNumber: "GP-00456",
    address: "45 MG Road",
    city: "Delhi",
    state: "Delhi",
    country: "India",
  },
  {
    id: 3,
    customerName: "Rahul Enterprises",
    mobileNumber: "9123456780",
    sapNumber: "10067890",
    gpNumber: "GP-00789",
    address: "Industrial Area",
    city: "Noida",
    state: "Uttar Pradesh",
    country: "India",
  },
  {
    id: 4,
    customerName: "Rahul & Sons",
    mobileNumber: "9018770155",
    sapNumber: "10123456",
    gpNumber: "GP-00987",
    address: "Salt Lake",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
  },
  {
    id: 5,
    customerName: "Rahul Traders",
    mobileNumber: "9898099988",
    sapNumber: "10123457",
    gpNumber: "GP-00991",
    address: "880 Bright Road",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
  },
];

// ============================================
// DUMMY SAVED CUSTOMERS
// ============================================

const savedCustomers: Customer[] = [];

// ============================================
// CUSTOMER SERVICE
// ============================================

const customerSearchService = {
  // ==========================================
  // SEARCH CUSTOMERS
  // ==========================================

  searchCustomers: async (
    payload: CustomerSearchRequest,
  ): Promise<Customer[]> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    const sapNumber = payload.sapNumber
      .trim()
      .toLowerCase();

    const customerName = payload.customerName
      .trim()
      .toLowerCase();

    const results = dummyCustomers.filter(
      (customer) => {
        const sapMatches =
          !sapNumber ||
          customer.sapNumber
            .toLowerCase()
            .includes(sapNumber);

        const nameMatches =
          !customerName ||
          customer.customerName
            .toLowerCase()
            .includes(customerName);

        return sapMatches && nameMatches;
      },
    );

    return results;
  },

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  saveCustomer: async (
    customer: Customer,
  ): Promise<SaveCustomerResponse> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    // Duplicate check
    const alreadyExists = savedCustomers.some(
      (item) =>
        item.sapNumber === customer.sapNumber,
    );

    if (alreadyExists) {
      return {
        success: false,
        message:
          "Customer already exists in the system.",
      };
    }

    savedCustomers.push(customer);

    return {
      success: true,
      message: "Customer saved successfully.",
      data: customer,
    };
  },
};

export default customerSearchService;