import React from "react";

import type {
  skivingApprovalRow,
} from "../types/skivingApproval.types";

type Props = {
  data: skivingApprovalRow[];

  onInspect: (
    item: skivingApprovalRow
  ) => void;
};

const calculateTurnAroundHours = (
  dateStr: string
): number => {
  if (!dateStr) return 0;

  const collected = new Date(dateStr);

  const now = new Date();

  return Math.floor(
    (now.getTime() -
      collected.getTime()) /
    (1000 * 60 * 60)
  );
};

const SkivingApprovalTable = ({
  data,
  onInspect,
}: Props) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th>Production No</th>
            <th>Date</th>
            <th>Tyre Ref No</th>
            <th>Pattern</th>

            <th className="text-center">
              Tyre Size
            </th>

            <th>Service</th>

            <th>Batch No</th>

            <th className="text-center">
              Available @ Station /
              Batch
            </th>

            <th className="text-center">
              Turnaround (hrs)
            </th>

            <th className="text-center">
              Zone Alarm
            </th>

            <th className="text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={11}
                className="text-center text-muted py-4"
              >
                No Skiving Approval
                records available
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const hours =
                calculateTurnAroundHours(
                  item.date
                );

              return (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {item.casing}
                    </strong>
                  </td>

                  <td>
                    {item.date}
                  </td>

                  <td>
                    {item.serial}
                  </td>

                  <td>
                    {item.pattern}
                  </td>

                  <td className="text-center">
                    {item.tyreSize}
                  </td>

                  <td>
                    <span
                      className={`badge ${item.service ===
                        "Claim"
                        ? "bg-warning text-dark"
                        : "bg-primary"
                        }`}
                    >
                      {item.service}
                    </span>
                  </td>

                  <td>
                    {item.batchNo}
                  </td>

                  <td className="text-center">
                    {
                      item.tyresAvailable
                    }
                    {" / "}
                    {
                      item.tyresCollected
                    }
                  </td>

                  <td className="text-center">
                    <strong>
                      {hours}
                    </strong>
                  </td>

                  <td className="text-center">
                    {hours >
                      72 ? (
                      <span className="badge bg-danger">
                        ⚠{" "}
                        {item.collectorZone ||
                          "Zone"}
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        OK
                      </span>
                    )}
                  </td>

                  <td className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        onInspect(item);
                      }}
                    >
                      Inspect{" "}
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SkivingApprovalTable;