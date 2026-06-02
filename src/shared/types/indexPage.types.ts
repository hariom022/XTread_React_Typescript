export interface IndexPagenRow {
  id: number;

  casing: string;
  date: string;
  serial: string;
  dot: string;

  pattern: string;
  requestedPattern: string;

  tyreSize: string;
  customerName: string;

  service: string;

  batchNo: string;

  isRetreaded: boolean;

  previousPattern: string;
  previousRetreader: string;

  noOfRetread: number | string;
  noOfExistingRepairs: number | string;

  tyresPerBatch: number;
  qtyAtStation: number;

  collectorZone: string;
}