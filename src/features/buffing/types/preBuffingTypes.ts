export interface PreBuffingRow {
  id: number;

  casing: string;
  serial: string;

  customerName: string;

  tyreSize: string;
  tyreMake: string;

  model: string;

  pattern: string;
  requestedPattern: string;

  brand: string;
  width: string;

  treadPatternId?: number;
  treadPatternVariantId?: number;

  currentStage: number;
  currentSubstage: number;
  currentStageStatus: number;
}