// src/features/collection/components/CustomerSelection.tsx
import "../styles/Collection.css"
import type {
  Customer,
} from "../types/collection.types";

type Props = {
  customers: Customer[];

  selectedCustomer: Customer | null;

  setSelectedCustomer: (
    customer: Customer | null,
  ) => void;

  orderItemsLength?: number;
};

const CustomerSelection = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  orderItemsLength = 0,
}: Props) => {
  return (
    <div className="card modern-card">
      {/* CARD HEADER */}
      <div className="card-header modern-header">
        Customer Selection
      </div>

      {/* CARD BODY */}
      <div className="card-body">
        {/* CUSTOMER NAME */}
        <label className="form-label">
          Customer Name
        </label>

        <select
          className="form-select modern-input mb-3"
          value={
            selectedCustomer?.customerNumber ||
            ""
          }
          onChange={(e) => {
            const customer = customers.find(
              (c) =>
                c.customerNumber ===
                e.target.value,
            );

            setSelectedCustomer(
              customer || null,
            );
          }}
          disabled={orderItemsLength > 0}
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.customerNumber}
              value={customer.customerNumber}
            >
              {customer.customerName}
            </option>
          ))}
        </select>

        {/* CONTACT PERSON */}
        <input
          className="form-control modern-input mt-2"
          placeholder="Contact Person"
          value={
            selectedCustomer?.customerName ||
            ""
          }
          readOnly
        />

        {/* MOBILE */}
        <input
          className="form-control modern-input mt-2"
          placeholder="Mobile"
          value={
            selectedCustomer?.mobileNumber ||
            ""
          }
          readOnly
        />

        {/* EMAIL */}
        <input
          className="form-control modern-input mt-2"
          placeholder="Email"
          value={selectedCustomer?.email || ""}
          readOnly
        />

        {/* BOTTOM ROW */}
        <div className="row mt-3">
          {/* ACCOUNT MANAGER */}
          <div className="col-md-6">
            <input
              className="form-control modern-input"
              placeholder="Account Manager"
              value={
                selectedCustomer?.salesGroupDescription ||
                ""
              }
              readOnly
            />
          </div>

          {/* ZONE */}
          <div className="col-md-6">
            <input
              className="form-control modern-input"
              placeholder="Zone"
              
              readOnly
            />
          </div>
        </div>

        {/* CUSTOMER DETAILS */}
        {selectedCustomer && (
          <div className="mt-3">
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <th >
                      Customer No
                    </th>

                    <td>
                      {
                        selectedCustomer.customerNumber
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>Customer Name</th>

                    <td>
                      {
                        selectedCustomer.customerName
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>Mobile</th>

                    <td>
                      {
                        selectedCustomer.mobileNumber
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>Email</th>

                    <td>
                      {selectedCustomer.email}
                    </td>
                  </tr>

                  <tr>
                    <th>
                      Account Manager
                    </th>

                    <td>
                      {
                        selectedCustomer.salesGroupDescription
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSelection;