type ApiErrorResponse = {
  error?: {
    message?: string;
  } | string | null;
  message?: string;
  title?: string;
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

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "Unable to complete the request. Please try again."
): string => {
  const err = error as ApiRequestError;
  const response = err.response;
  const data = response?.data;

  // Handle a plain-text error response.
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    // Handle ASP.NET Core validation errors.
    if (data.errors) {
      const messages = Object.values(data.errors)
        .flat()
        .filter((message) => typeof message === "string" && message.trim());

      if (messages.length > 0) {
        return [...new Set(messages)].join("\n");
      }
    }

    // Handle the ApiResponse returned by your controller.
    if (
      typeof data.error === "object" &&
      data.error?.message
    ) {
      return data.error.message;
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }

    if (data.message?.trim()) {
      return data.message;
    }

    if (data.title?.trim()) {
      return data.title;
    }
  }

  // Handle network and timeout errors.
  if (!response) {
    if (
      err.code === "ECONNABORTED" ||
      err.code === "ETIMEDOUT"
    ) {
      return "The request timed out. Please try again.";
    }

    if (err.message === "Network Error") {
      return "Unable to connect to the server. Check your connection.";
    }

    return fallbackMessage;
  }

  // Handle server errors without exposing internal details.
  if (response.status !== undefined && response.status >= 500) {
    return "A server error occurred. Please try again later.";
  }

  // Handle a 400 response without a specific error message.
  if (response.status === 400 || response.status === 422) {
    return "Some information is missing or invalid. Please check the form.";
  }

  return fallbackMessage;
};