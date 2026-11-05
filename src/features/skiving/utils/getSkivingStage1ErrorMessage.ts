
type ApiErrorResponse = {
  error?: {
    message?: string;
  } | string | null;
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]> | string[];
};

type ApiRequestError = {
  message?: string;
  code?: string;
  response?: {
    status?: number;
    data?: ApiErrorResponse | string;
  };
};

export const getSkivingStage1ErrorMessage = (
  error: unknown,
  fallbackMessage = "Failed to save Skiving Stage 1.",
): string => {
  const err = error as ApiRequestError;
  const data = err.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    if (data.errors) {
      const messages = Array.isArray(data.errors)
        ? data.errors
        : Object.values(data.errors).flat();

      const validMessages = messages.filter(
        (message): message is string =>
          typeof message === "string" && message.trim().length > 0,
      );

      if (validMessages.length) {
        return [...new Set(validMessages)].join("\n");
      }
    }

    if (
      typeof data.error === "object" &&
      data.error?.message?.trim()
    ) {
      return data.error.message;
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }

    if (data.message?.trim()) {
      return data.message;
    }

    if (data.detail?.trim()) {
      return data.detail;
    }

    if (
      data.title?.trim() &&
      data.title !== "One or more validation errors occurred."
    ) {
      return data.title;
    }
  }

  if (!err.response) {
    if (
      err.code === "ECONNABORTED" ||
      err.code === "ETIMEDOUT"
    ) {
      return "The request timed out. Please try again.";
    }

    if (err.message === "Network Error") {
      return "Unable to connect to the server. Check your network connection.";
    }
  }

  if (err.response?.status === 401) {
    return "Your session may have expired. Please sign in again.";
  }

  if (err.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (err.response?.status && err.response.status >= 500) {
    return "A server error occurred. Please try again later.";
  }

  return fallbackMessage;
};
