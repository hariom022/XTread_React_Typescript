
type ApiErrorBody = {
  error?: { code?: string; message?: string; details?: unknown } | string | null;
  message?: string;
  title?: string;
  detail?: string;
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

export const getPressureTestErrorMessage = (
  error: unknown,
  fallbackMessage = "Unable to complete the Pressure Test request. Please try again.",
): string => {
  console.error("PRESSURE TEST API ERROR:", error);

  const err = error as ApiRequestError;
  const status = err.response?.status;
  const data = err.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim().replace(/^["']|["']$/g, "");
  }

  if (data && typeof data === "object") {
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

    if (
      data.error &&
      typeof data.error === "object" &&
      typeof data.error.message === "string" &&
      data.error.message.trim()
    ) {
      return data.error.message.trim();
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

  if (!err.response) {
    if (
      err.code === "ECONNABORTED" ||
      err.code === "ETIMEDOUT"
    ) {
      return "The request timed out. Please try again.";
    }

    if (
      err.code === "ERR_NETWORK" ||
      err.message === "Network Error"
    ) {
      return "Unable to connect to the server. Please check your network connection.";
    }
  }

  if (status === 400 || status === 422) {
    return "The request contains invalid or incomplete information. Please check your entries.";
  }

  if (status === 401) {
    return "Your session may have expired. Please sign in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested Pressure Test information could not be found.";
  }

  if (status === 409) {
    return "The casing status may have changed. Refresh the page and try again.";
  }

  if (typeof status === "number" && status >= 500) {
    return "The server is unable to process the request right now. Please try again later.";
  }

  return fallbackMessage;
};
