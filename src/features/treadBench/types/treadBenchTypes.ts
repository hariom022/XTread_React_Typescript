// types/stock.ts

export interface WasteForm {
  wasteKg: string;
  treadPattern: string;
  width: string;
  cementType: string;
}

export interface StockManagementModalProps {
  wasteForm: WasteForm;
  setWasteForm: React.Dispatch<React.SetStateAction<WasteForm>>;
  wasteRows: WasteForm[];
  setWasteRows: React.Dispatch<React.SetStateAction<WasteForm[]>>;
  onClose: () => void;
  setWaste: React.Dispatch<React.SetStateAction<number>>;
}

export interface InspectionItem {
  id: number;
  casing: string;
  serial: string;
  tyreSize: string;
  service: string;
  pattern: string;
  width?: string;
  circumference?: string;
  brand?: string;
  productionNumber?: string;
}

export interface TreadBenchInspectionModalProps {
  selectedItem: InspectionItem | null;
  staffName: string;
  cementTypes: CementType[];

  loadCementTypes: () => Promise<void>;
  handleSave: (payload: any) => Promise<void>;
  onClose: () => void;
}

export interface CementType {
  cementTypeId: number;
  displayName: string;
//   sapCode: string | null;
//   sapDescription: string;
//   sortOrder: number;
 }