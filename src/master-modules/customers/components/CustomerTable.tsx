import type { Customer } from "../types/customer.types";

interface CustomerTableProps {
  customers: Customer[];

  selectedCustomerRows: string[];

  toggleCustomerRow: (
    customerNumber: string
  ) => void;

  toggleAllCustomers: () => void;
}

const CustomerTable = ({
  customers,
  selectedCustomerRows,
  toggleCustomerRow,
  toggleAllCustomers,
}: CustomerTableProps) => {
  const isAllSelected =
    customers.length > 0 &&
    selectedCustomerRows.length === customers.length;

  return (
    <div className="customer-table-wrapper">
      <table className="table customer-table mb-0">
        <thead>
          <tr>
            {/* Checkbox
            <th style={{ width: "45px" }}>
              <input
                type="checkbox"
                className="customer-checkbox"
                onChange={toggleAllCustomers}
                checked={isAllSelected}
              />
            </th> */}

            <th>Customer No</th>

            <th>Customer Name</th>

            <th>Search Term</th>

            <th>Company Code</th>

            <th>Sales Group</th>

            <th>Customer Group</th>

            <th>Mobile Number</th>

            <th>Email</th>

            <th>Price List</th>

            <th>City</th>

            <th>Country</th>

            <th>Source System</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={13}
                className="customer-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            customers.map((item) => (
              <tr key={item.customerNumber}>
                {/* Checkbox */}
                {/* <td>
                  <input
                    type="checkbox"
                    className="customer-checkbox"
                    checked={selectedCustomerRows.includes(
                      item.customerNumbers
                    )}
                    onChange={() =>
                      toggleCustomerRow(
                        item.customerNumber
                      )
                    }
                  />
                </td> */}

                {/* Customer Number */}
                <td>
                  <span className="customer-number">
                    {item.customerNumber}
                  </span>
                </td>

                {/* Customer Name */}
                <td>
                  <span className="customer-name">
                    {item.customerName}
                  </span>
                </td>

                {/* Search Term */}
                <td>
                  {item.searchTerm || "-"}
                </td>

                {/* Company Code */}
                <td>
                  {item.companyCode || "-"}
                </td>

                {/* Sales Group */}
                <td>
                  <div className="customer-group-cell">
                    <span className="customer-code">
                      {item.salesGroup || "-"}
                    </span>

                    <span className="customer-description">
                      {item.salesGroupDescription ||
                        "-"}
                    </span>
                  </div>
                </td>

                {/* Customer Group */}
                <td>
                  <div className="customer-group-cell">
                    <span className="customer-code">
                      {item.customerGroup || "-"}
                    </span>

                    <span className="customer-description">
                      {item.customerGroupDescription ||
                        "-"}
                    </span>
                  </div>
                </td>

                {/* Mobile */}
                <td>
                  {item.mobileNumber || "-"}
                </td>

                {/* Email */}
                <td>
                  {item.email || "-"}
                </td>

                {/* Price List */}
                <td>
                  <div className="customer-group-cell">
                    <span className="customer-code">
                      {item.priceList || "-"}
                    </span>

                    <span className="customer-description">
                      {item.priceListDescription ||
                        "-"}
                    </span>
                  </div>
                </td>

                {/* City */}
                <td>
                  {item.city || "-"}
                </td>

                {/* Country */}
                <td>
                  <span className="country-badge">
                    {item.country || "-"}
                  </span>
                </td>

                {/* Source System */}
                <td>
                  {item.sourceSystem || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;