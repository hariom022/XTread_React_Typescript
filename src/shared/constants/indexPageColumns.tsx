export const indexPageColumns = (onInspect: any) => [
  {
    header: "Production No",
    accessor: "casing",
    render: (item: any) => <strong>{item.casing}</strong>,
  },

  {
    header: "Date",
    render: (item: any) =>
      item.date ? new Date(item.date).toLocaleDateString("en-GB") : "-",
  },
  {
    header: "Customer Name",
    accessor: "customerName",
  },
  {
    header: "Tyre Ref No",
    accessor: "serial",
  },

  {
    header: "Pattern",
    accessor: "patternName",
  },

  {
    header: "Tyre Size",
    accessor: "tyreSize",
  },
  {
    header: "Make",
    accessor: "brand",
  },

  {
    header: "Service",
    render: (item: any) => (
      <span
        className={`badge ${
          item.service === "Claim" ? "bg-warning text-dark" : "bg-primary"
        }`}
      >
        {item.service}
      </span>
    ),
  },

  // {
  //   header: "Batch No",
  //   accessor: "batchNo",
  // },
  // ================= TURNAROUND =================
  {
    header: "Turnaround (hrs)",
    render: (item: any) => {
      if (!item.date) return "-";

      const createdTime = new Date(item.date).getTime();
      const now = new Date().getTime();

      const hours = ((now - createdTime) / (1000 * 60 * 60)).toFixed(1);

      return <span className="fw-semibold">{hours}</span>;
    },
  },
  // ================= ZONE ALARM =================
  {
    header: "Zone Alarm",
    render: (item: any) => {
      if (!item.date) return "-";

      const createdTime = new Date(item.date).getTime();
      const now = new Date().getTime();

      const hours = (now - createdTime) / (1000 * 60 * 60);

      let badgeClass = "bg-success";
      let label = "GREEN";

      if (hours >= 24 && hours < 48) {
        badgeClass = "bg-warning text-dark";
        label = "AMBER";
      }

      if (hours >= 48) {
        badgeClass = "bg-danger";
        label = "RED";
      }

      return <span className={`badge ${badgeClass}`}>{label}</span>;
    },
  },
  {
    header: "Action",
    render: (item: any) => (
      <button className="btn btn-danger btn-sm" onClick={() => onInspect(item)}>
        Inspect
      </button>
    ),
  },
];
