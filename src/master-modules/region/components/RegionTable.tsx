import type { Region } from "../types/region.types";

interface RegionTableProps {
  regions: Region[];
}

const RegionTable = ({ regions }: RegionTableProps) => {
  return (
    <div className="region-table-wrapper">
      <table className="table region-table mb-0">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Region Name</th>
            <th>Region Initial</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}
          {regions.length === 0 ? (
            <tr>
              <td colSpan={3} className="region-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            regions.map((item) => (
              <tr key={item.id}>
                {/* ID */}
                <td>
                  <span className="region-id">{item.id}</span>
                </td>

                {/* NAME */}
                <td>
                  <span className="region-name">{item.regionName}</span>
                </td>

                {/* INITIAL */}
                <td>
                  <span className="region-initial">
                    {item.regionInitial}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegionTable;