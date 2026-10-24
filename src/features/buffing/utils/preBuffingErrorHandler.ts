
type ApiErrorResponse = {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  } | string | null;
  message?: string;
  title?: string;
  errors?: Record<string, string[] | string>;
};

const getReadableMessage = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const message = value.trim();

  if (
    !message ||
    message.startsWith("{") ||
    message.startsWith("[") ||
    /^(AxiosError|TypeError|ReferenceError|SyntaxError):/.test(message) ||
    /^Request failed with status code \d+$/i.test(message)
  ) {
    return null;
  }

  return message;
};

export const getPreBuffingErrorMessage = (
  error: unknown,
  fallback = "Unable to complete the Pre-Buffing operation. Please try again.",
): string => {
  const response = (
    error as {
      response?: {
        status?: number;
        data?: ApiErrorResponse;
      };
    }
  )?.response;

  const data = response?.data;

  // Backend business and not-found errors
  const apiError =
    typeof data?.error === "object" && data.error !== null
      ? data.error
      : null;

  const message =
    getReadableMessage(apiError?.message) ||
    getReadableMessage(typeof data?.error === "string" ? data.error : null) ||
    getReadableMessage(data?.message) ||
    getReadableMessage(data?.title);

  if (message) return message;

  // ASP.NET Core model-validation responses
  if (data?.errors && typeof data.errors === "object") {
    const validationMessages = Object.values(data.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map(getReadableMessage)
      .filter((value): value is string => value !== null);

    if (validationMessages.length > 0) {
      return [...new Set(validationMessages)].join("\n");
    }
  }

  // Friendly fallbacks for errors without a readable backend message
  if (response?.status === 404) {
    return "The requested casing or Pre-Buffing record could not be found.";
  }

  if (response?.status === 400) {
    return "The request could not be completed. Please check the selected values.";
  }

  if (response?.status === 401) {
    return "Your session may have expired. Please sign in again.";
  }

  if (response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (response?.status && response.status >= 500) {
    return "A server error occurred while processing Pre-Buffing. Please try again later.";
  }

  if (!response) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  return fallback;
};
