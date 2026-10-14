
type ApiErrorBody = {
  error?: string | { message?: string } | null;
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

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "The request could not be completed. Please try again.",
): string => {
  const err = error as ApiRequestError;
  const data = err.response?.data;

  // Batch controller returns plain-text errors.
  if (typeof data === "string" && data.trim()) {
    return data.trim().replace(/^["']|["']$/g, "");
  }

  if (data && typeof data === "object") {
    // ASP.NET Core model-validation errors.
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

    // ApiResponse error: { error: { message: "..." } }
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
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
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

  if (err.response?.status !== undefined && err.response.status >= 500) {
    return "A server error occurred. Please try again later.";
  }

  return fallbackMessage;
};
