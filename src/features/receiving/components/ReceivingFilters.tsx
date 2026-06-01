import Select from "react-select";

type Props = {
  customerOptions: {
    value: string;
    label: string;
  }[];

  selectedCustomer: string;

  setSelectedCustomer: (
    customer: string,
  ) => void;

  selectedDate: string;

  setSelectedDate: (
    date: string,
  ) => void;
};

const ReceivingFilters = ({
  customerOptions,
  selectedCustomer,
  setSelectedCustomer,
  selectedDate,
  setSelectedDate,
}: Props) => {
  return (
    <div className="mb-3 d-flex gap-3 flex-wrap align-items-center">
      <div
        style={{
          width: "300px",
        }}
      >
        <Select
          options={customerOptions}
          value={
            customerOptions.find(
              (x) =>
                x.value === selectedCustomer,
            ) || null
          }
          onChange={(option) =>
            setSelectedCustomer(
              option?.value || "all",
            )
          }
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        <label className="fw-bold mb-0">
          Date:
        </label>

        <input
          type="date"
          className="form-control"
          style={{
            width: "180px",
          }}
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value,
            )
          }
        />
      </div>
    </div>
  );
};

export default ReceivingFilters;