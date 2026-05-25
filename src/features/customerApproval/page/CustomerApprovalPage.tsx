import { useMemo, useState } from "react";

import CustomerApprovalModal from "../components/CustomerApprovalModal";

import CustomerOrderTable from "../components/CustomerOrderTable";

import { useCustomerApproval } from "../hooks/useCustomerApproval";
import Select from "react-select";

const CustomerApprovalPage = () => {
  const {
    approvalList,
    loadOrderList,

    selectedCustomer,
    setSelectedCustomer,

    selectedDate,
    setSelectedDate,
  } = useCustomerApproval();

  const [expandedCollection, setExpandedCollection] = useState<string | null>(
    null,
  );

  const [showModal, setShowModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // FILTERED LIST
  const filteredApprovalList = useMemo(() => {
    return approvalList.filter((item) => {
      const matchesCustomer =
        selectedCustomer === "all" ||
        item.customer?.customerName === selectedCustomer;

      const matchesDate =
        !selectedDate || item.createdAtUtc?.split("T")[0] === selectedDate;

      return matchesCustomer && matchesDate;
    });
  }, [approvalList, selectedCustomer, selectedDate]);

  // GROUP DATA
  const groupedCollections = useMemo(() => {
    const map: Record<string, any[]> = {};

    filteredApprovalList.forEach((item) => {
      if (!map[item.orderNumber]) {
        map[item.orderNumber] = [];
      }

      map[item.orderNumber].push(item);
    });

    return map;
  }, [filteredApprovalList]);

  const toggleCollection = (orderNo: string) => {
    setExpandedCollection((prev) => (prev === orderNo ? null : orderNo));
  };

  const handleOpenApproval = (orderNo: string, items: any[]) => {
    setSelectedOrder({
      orderNo,
      items,
    });

    setShowModal(true);
  };

  // UNIQUE CUSTOMER LIST
const customerNames = [
  "all",

  ...new Set(
    approvalList
      .map(
        (x) => x.customer?.customerName,
      )
      .filter(
        (
          name,
        ): name is string => !!name,
      ),
  ),
];

  return (
    <div className="container-fluid mt-3">
      {/* FILTER SECTION */}
      <div className="mb-3 d-flex align-items-center gap-3 flex-wrap">
        {/* CUSTOMER FILTER */}
        <div style={{ minWidth: "320px", width: "320px" }}>
          <Select
            options={customerNames.map((name) => ({
              value: name,
              label: name === "all" ? "All Customers" : name,
            }))}
            value={{
              value: selectedCustomer,
              label:
                selectedCustomer === "all" ? "All Customers" : selectedCustomer,
            }}
            onChange={(selected) =>
              setSelectedCustomer(selected?.value || "all")
            }
          />
        </div>

        {/* DATE FILTER */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0">Date:</label>

          <input
            type="date"
            className="form-control"
            style={{ width: "180px" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <CustomerOrderTable
        groupedCollections={groupedCollections}
        expandedCollection={expandedCollection}
        toggleCollection={toggleCollection}
        handleOpenApproval={handleOpenApproval}
      />

      {/* MODAL */}
      {showModal && (
        <CustomerApprovalModal
          selectedOrder={selectedOrder}
          onClose={() => setShowModal(false)}
          onSuccess={loadOrderList}
        />
      )}
    </div>
  );
};

export default CustomerApprovalPage;
