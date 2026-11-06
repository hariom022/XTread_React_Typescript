
type ApiErrorResponse = {
  error?: {
    message?: string;
  } | string | null;
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

type ApiRequestError = {
  message?: string;
  code?: string;
  response?: {
    status?: number;
    data?: ApiErrorResponse | string;
  };
};

const DEFAULT_ERROR_MESSAGE =
  "Unable to save casing. Please check the entered details and try again.";

const CASING_VALIDATION_MESSAGE =
  "Please check the casing details. Tyre Reference Number and other required fields must be filled correctly.";

const RETREAD_VALIDATION_MESSAGE =
  "Please enter a valid number of retreads.";

const REPAIR_VALIDATION_MESSAGE =
  "Please enter a valid number of repairs.";

const REQUIRED_FIELD_MESSAGE =
  "Please fill in all required fields before submitting.";

const NETWORK_ERROR_MESSAGE =
  "Unable to connect to the server. Please check your internet connection.";

/**
 * Extract readable text from API response values.
 */
const extractMessage = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map(extractMessage)
      .filter(Boolean)
      .join(" ");
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    return [
      obj.message,
      obj.title,
      obj.detail,
      obj.error,
    ]
      .map(extractMessage)
      .filter(Boolean)
      .join(" ");
  }

  return "";
};

/**
 * Convert backend technical errors into user-friendly messages.
 */
export const getApiErrorMessage = (
  error: unknown
): string => {
  const apiError = error as ApiRequestError;

  const responseData = apiError?.response?.data;

  // Handle plain string backend responses.
  const responseText =
    typeof responseData === "string"
      ? responseData
      : "";

  const data =
    typeof responseData === "object" &&
    responseData !== null
      ? (responseData as ApiErrorResponse)
      : undefined;

  // Collect all backend error messages.
  const validationMessages = data?.errors
    ? Object.values(data.errors)
        .flat()
        .filter(
          (message): message is string =>
            typeof message === "string"
        )
        .join(" ")
    : "";

  const rawMessage = [
    responseText,
    data?.title,
    data?.detail,
    data?.message,
    extractMessage(data?.error),
    validationMessages,
    apiError?.message,
  ]
    .filter(Boolean)
    .join(" ");

  const normalizedMessage = rawMessage.toLowerCase();

  // JSON deserialization / conversion errors.
  if (
    normalizedMessage.includes("could not be converted") ||
    normalizedMessage.includes("json value could not be converted") ||
    normalizedMessage.includes("input string was not in a correct format") ||
    normalizedMessage.includes("error converting value")
  ) {
    if (
      normalizedMessage.includes("noofretread")
    ) {
      return RETREAD_VALIDATION_MESSAGE;
    }

    if (
      normalizedMessage.includes("noofrepairs")
    ) {
      return REPAIR_VALIDATION_MESSAGE;
    }

    return CASING_VALIDATION_MESSAGE;
  }

  // Required field errors.
  if (
    normalizedMessage.includes("request field is required") ||
    normalizedMessage.includes("field is required") ||
    normalizedMessage.includes("required field")
  ) {
    return REQUIRED_FIELD_MESSAGE;
  }

  // ASP.NET Core validation errors without conversion issues.
  if (validationMessages) {
    return validationMessages;
  }

  // Backend business errors.
  if (data?.error) {
    const businessError = extractMessage(data.error);

    if (businessError) {
      return businessError;
    }
  }

  // Backend message.
  if (data?.message) {
    return data.message;
  }

  // Network errors.
  if (!apiError?.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  // Generic HTTP errors.
  switch (apiError.response.status) {
    case 400:
      return "Invalid information submitted. Please check the entered details.";

    case 401:
      return "Your session has expired. Please log in again.";

    case 403:
      return "You are not authorized to perform this action.";

    case 404:
      return "The requested information was not found.";

    case 409:
      return "This operation cannot be completed because of a conflict.";

    case 422:
      return "Please check the entered details and try again.";

    case 500:
    case 502:
    case 503:
    case 504:
      return "Something went wrong on the server. Please try again later.";

    default:
      return DEFAULT_ERROR_MESSAGE;
  }
};
