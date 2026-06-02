

export const indexPageColumns = (onInspect: any) => [
  {
    header: "Production No",
    accessor: "casing",
    render: (item: any) => <strong>{item.casing}</strong>,
  },

  {
    header: "Date",
    accessor: "date",
  },

  {
    header: "Tyre Ref No",
    accessor: "serial",
  },

  {
    header: "Pattern",
    accessor: "pattern",
  },

  {
    header: "Tyre Size",
    accessor: "tyreSize",
  },

  {
    header: "Service",
    render: (item: any) => (
      <span
        className={`badge ${
          item.service === "Claim"
            ? "bg-warning text-dark"
            : "bg-primary"
        }`}
      >
        {item.service}
      </span>
    ),
  },

  {
    header: "Batch No",
    accessor: "batchNo",
  },

  {
    header: "Action",
    render: (item: any) => (
      <button
        className="btn btn-danger btn-sm"
        onClick={() => onInspect(item)}
      >
        Inspect
      </button>
    ),
  },
];