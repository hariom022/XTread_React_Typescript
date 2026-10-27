import type { Zone } from "../types/zone.types";

interface ZoneTableProps {
  zones: Zone[];
}

const ZoneTable = ({ zones }: ZoneTableProps) => {
  return (
    <div className="zone-table-wrapper">
      <table className="table zone-table mb-0">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Region</th>
            <th>Zone Name</th>
            <th>Zone Initial</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}
          {zones.length === 0 ? (
            <tr>
              <td colSpan={4} className="zone-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            zones.map((item) => (
              <tr key={item.id}>
                {/* ID */}
                <td>
                  <span className="zone-id">{item.id}</span>
                </td>

                {/* REGION NAME */}
                <td>
                  <span className="zone-region-badge">{item.regionName}</span>
                </td>
                
                {/* ZONE NAME */}
                <td>
                  <span className="zone-name">{item.zoneName}</span>
                </td>

                {/* INITIAL */}
                <td>
                  <span className="zone-initial">{item.zoneInitial}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneTable;