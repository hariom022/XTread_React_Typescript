
type ApiErrorBody = {
  success?: boolean;
  error?:
    | {
        code?: string;
        message?: string;
        details?: unknown;
      }
    | string
    | null;
  message?: string;
  title?: string;
  detail?: string;
  details?: unknown;
  errors?: Record<string, string[] | string> | string[];
};

type ApiRequestError = {
  message?: string;
  code?: string;
  response?: {
    status?: number;
    data?: ApiErrorBody | string;
  };
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "The request could not be completed. Please try again.",
): string => {
  const err = error as ApiRequestError;
  const data = err.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    // ASP.NET Core validation errors
    if (data.errors) {
      const messages = Array.isArray(data.errors)
        ? data.errors
        : Object.values(data.errors).flatMap((value) =>
            Array.isArray(value) ? value : [value],
          );

      const validMessages = messages.filter(
        (message): message is string =>
          typeof message === "string" && message.trim().length > 0,
      );

      if (validMessages.length > 0) {
        return [...new Set(validMessages)].join("\n");
      }
    }

    // Custom ApiResponse error
    if (data.error && typeof data.error === "object") {
      if (
        typeof data.error.message === "string" &&
        data.error.message.trim()
      ) {
        return data.error.message.trim();
      }

      if (typeof data.error.code === "string") {
        return `Request failed (${data.error.code}).`;
      }
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }

    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail.trim();
    }

    if (
      typeof data.title === "string" &&
      data.title.trim() &&
      data.title !== "One or more validation errors occurred."
    ) {
      return data.title.trim();
    }
  }

  // Network and timeout errors
  if (!err.response) {
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return "The request timed out. Please try again.";
    }

    if (err.message === "Network Error") {
      return "Unable to connect to the server. Check your network connection.";
    }
  }

  // HTTP errors
  switch (err.response?.status) {
    case 400:
      return "The customer approval request is invalid. Please check the entered details.";
    case 401:
      return "Your session may have expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested order was not found.";
    case 413:
      return "The signature or request is too large. Please try again.";
    default:
      if (err.response?.status && err.response.status >= 500) {
        return "A server error occurred. Please try again later.";
      }

      return fallbackMessage;
  }
};
