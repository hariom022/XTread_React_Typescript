export const CASING_STAGES = {
  Collection: 1,
  Receiving: 2,
  VisualInspection: 3,
  NailInspection: 4,
  PressureTest: 5,
  Shearography: 6,
  Buffing: 7,
  Skiving: 8,
  Cementing: 9,
  Repairs: 10,
  FillUp: 11,
  Building: 12,
  Enveloping: 13,
  Curing: 14,
  QualityControl: 15,
  Dispatched: 16,
} as const;

export const CASING_STAGE_NAMES: Record<
  number,
  string
> = {
  [CASING_STAGES.Collection]: "Collection",
  [CASING_STAGES.Receiving]: "Receiving",
  [CASING_STAGES.VisualInspection]: "Visual Inspection",
  [CASING_STAGES.NailInspection]: "Nail Inspection",
  [CASING_STAGES.PressureTest]: "Pressure Test",
  [CASING_STAGES.Shearography]: "Shearography",
  [CASING_STAGES.Buffing]: "Buffing",
  [CASING_STAGES.Skiving]: "Skiving",
  [CASING_STAGES.Cementing]: "Cementing",
  [CASING_STAGES.Repairs]: "Repairs",
  [CASING_STAGES.FillUp]: "Fill Up",
  [CASING_STAGES.Building]: "Building",
  [CASING_STAGES.Enveloping]: "Enveloping",
  [CASING_STAGES.Curing]: "Curing",
  [CASING_STAGES.QualityControl]: "Quality Control",
  [CASING_STAGES.Dispatched]: "Dispatched",
};

export const getCasingStageName = (
  casingStageId: number
): string => {
  return (
    CASING_STAGE_NAMES[casingStageId] ||
    "Unknown Stage"
  );
};