import type { Customer } from "../types/customer.types";

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  isAllSelected: boolean;
  onSelectCustomer: (customerNumber: string) => void;
  onSelectAll: (checked: boolean) => void;
  loading: boolean;
}

const CustomerTable = ({
  customers,
  selectedCustomers,
  isAllSelected,
  onSelectCustomer,
  onSelectAll,
  loading,
}: CustomerTableProps) => {
  if (loading) {
    return <div className="text-center p-4">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return <div className="text-center p-4">No customers found.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            {/* <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th> */}
            <th>Customer Number</th>
            <th>Customer Name</th>
            <th>Search Term</th>
            <th>Company Code</th>
            <th>Sales Group</th>
            <th>Sales Group Description</th>
            <th>Customer Group</th>
            <th>Customer Group Description</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Price List</th>
            <th>Price List Description</th>
            <th>City</th>
            <th>Country</th>
            <th>Source System</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerNumber}>
              {/* <td>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(
                    customer.customerNumber
                  )}
                  onChange={() =>
                    onSelectCustomer(customer.customerNumber)
                  }
                />
              </td> */}

              <td>{customer.customerNumber}</td>
              <td>{customer.customerName}</td>
              <td>{customer.searchTerm || "-"}</td>
              <td>{customer.companyCode || "-"}</td>
              <td>{customer.salesGroup || "-"}</td>
              <td>{customer.salesGroupDescription || "-"}</td>
              <td>{customer.customerGroup || "-"}</td>
              <td>{customer.customerGroupDescription || "-"}</td>
              <td>{customer.mobileNumber || "-"}</td>
              <td>{customer.email || "-"}</td>
              <td>{customer.priceList || "-"}</td>
              <td>{customer.priceListDescription || "-"}</td>
              <td>{customer.city || "-"}</td>
              <td>{customer.country || "-"}</td>
              <td>{customer.sourceSystem || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;