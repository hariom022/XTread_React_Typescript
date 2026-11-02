
export interface MaterialConsumptionAuditTrailItem {
  requestId: number;
  orderCasingId: number;
  orderNumber: string;
  customerNumber: string;
  customerName: string;
  barcodeNumber: string;
  productionNumber: string;
  tyreReferenceNumber: string;
  batchNumber: string;
  finishedMaterial: string;

  currentStage: number;
  currentStageStatus: number;
  materialConsumptionApproved: boolean;

  status: number;
  statusName: string;

  attemptCount: number;
  maxAutomaticAttempts: number;

  lastAttemptAtUtc: string | null;
  nextAttemptAtUtc: string | null;

  lastResponseStatusCode: number | null;
  lastAttemptSucceeded: boolean;
  lastAttemptStatus: string;
  lastErrorMessage: string | null;

  isRetryable: boolean;
  canManualRetry: boolean;

  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface MaterialConsumptionAuditTrailResponse {
  items: MaterialConsumptionAuditTrailItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface MaterialConsumptionAuditTrailApiResponse {
  success: boolean;
  data: MaterialConsumptionAuditTrailResponse;
  error: unknown | null;
}


export interface MaterialConsumptionRequestMaterial {
  id: number;
  material: string;
  materialDescription: string | null;
  consumedQuantity: number;
  unitOfMeasure: string;
  isApproved: boolean;
}

export interface MaterialConsumptionRequestCasing {
  orderCasingId: number;
  orderNumber: string;
  customerNumber: string;
  customerName: string;
  barcodeNumber: string;
  productionNumber: string;
  tyreReferenceNumber: string;
  batchNumber: string;
  currentStage: number;
  currentStageStatus: number;
  materials: MaterialConsumptionRequestMaterial[];
}

export interface MaterialConsumptionRequestAttempt {
  attemptId: number;
  attemptNumber: number;
  requestSentAtUtc: string;
  responseStatusCode: number | null;
  isSuccess: boolean;
  durationMs: number;
  status: string;
  failureMessage: string | null;
  hasRequestPayload: boolean;
  hasResponsePayload: boolean;
}

export interface MaterialConsumptionRequestDetails {
  requestId: number;
  orderCasingId: number;
  casing: MaterialConsumptionRequestCasing;

  idempotencyKey: string;
  finishedMaterial: string;

  status: number;
  attemptCount: number;
  maxAutomaticAttempts: number;

  nextAttemptAtUtc: string | null;
  responseStatusCode: number | null;

  productionNumber: string | null;
  materialDocumentGI: string | null;
  materialDocumentGR: string | null;
  reference1: string | null;

  lastErrorMessage: string | null;

  createdAtUtc: string;
  updatedAtUtc: string;

  attempts: MaterialConsumptionRequestAttempt[];
}

export interface MaterialConsumptionRequestDetailsApiResponse {
  success: boolean;
  data: MaterialConsumptionRequestDetails;
  error: unknown | null;
}


export interface OriginalRequestPayload {
  requestId: number;
  orderCasingId: number;
  requestPayload: string;
}

export interface OriginalRequestPayloadResponse {
  success: boolean;
  data: OriginalRequestPayload | null;
  error: {
    code?: string;
    message?: string;
    details?: unknown;
  } | null;
}

export interface MaterialConsumptionAttemptPayload {
  requestId: number;
  attemptId: number;
  attemptNumber: number;
  requestPayload: string | null;
  responsePayload: string | null;
}

export interface MaterialConsumptionAttemptPayloadResponse {
  success: boolean;
  data: MaterialConsumptionAttemptPayload | null;
  error: {
    code?: string;
    message?: string;
    details?: unknown;
  } | null;
}

