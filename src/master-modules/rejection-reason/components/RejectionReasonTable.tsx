import type { RejectionReason } from "../types/rejectionReason.types";
import { getCasingStageName } from "../constants/casingStages";
interface RejectionReasonTableProps {
  rejectionReasons: RejectionReason[];
}
const RejectionReasonTable = ({
  rejectionReasons,
}: RejectionReasonTableProps) => {
  return (
    <div className="rejection-reason-table-wrapper">
      <table className="table rejection-reason-table mb-0">
        <thead>
          <tr>
            <th>ID</th>

            <th>Code</th>

            <th>Rejection Reason</th>

            <th>Casing Stage</th>

            {/* <th>Casing Substage ID</th>

            <th>Category</th> */}

            <th>Sort Order</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {rejectionReasons.length === 0 ? (
            <tr>
              <td colSpan={7} className="rejection-reason-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            rejectionReasons.map((item) => (
              <tr key={item.rejectionReasonId}>
                {/* ID */}
                <td>
                  <span className="rejection-reason-id">
                    {item.rejectionReasonId}
                  </span>
                </td>

                {/* CODE */}
                <td>
                  <span className="rejection-reason-code">{item.code}</span>
                </td>

                {/* REASON */}
                <td>
                  <span className="rejection-reason-name">{item.reason}</span>
                </td>

                {/* CASING STAGE */}
                <td>
                  <span className="rejection-stage-badge">
                    {getCasingStageName(item.casingStageId)}
                  </span>
                </td>
                {/* <td>
                  <span className="rejection-stage-badge">
                    {item.casingStageId}
                  </span>
                </td> */}

                {/* CASING SUBSTAGE */}
                {/* <td>
                  {item.casingSubstageId ?? "-"}
                </td> */}

                {/* CATEGORY */}
                {/* <td>
                  {item.category || "-"}
                </td> */}

                {/* SORT ORDER */}
                <td>
                  <span className="rejection-sort-order">{item.sortOrder}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RejectionReasonTable;
