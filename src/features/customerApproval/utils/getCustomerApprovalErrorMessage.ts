
type ApiErrorResponse = {
  error?: {
    message?: string;
  } | string | null;
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
): string => {
  const err = error as any;
  const data = err?.response?.data;

  // Business errors
  if (data?.error?.message) {
    return data.error.message;
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  // ASP.NET Core validation errors
  if (data?.errors) {
    const messages = Object.values(
      data.errors as Record<string, string[]>,
    )
      .flat()
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join("\n");
    }
  }

  const rawMessage = [
    data?.title,
    data?.detail,
    data?.message,
    err?.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // JSON conversion / missing required fields
  if (
    rawMessage.includes("could not be converted") ||
    rawMessage.includes("request field is required") ||
    rawMessage.includes("required property")
  ) {
    return "Please check the required fields and enter valid casing details.";
  }

  // Network errors
  if (!err?.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // HTTP errors
  switch (err.response.status) {
    case 400:
      return "Invalid information submitted. Please check the entered details.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You are not authorized to perform this action.";
    case 404:
      return "The requested casing or order was not found.";
    case 409:
      return "This casing cannot be updated because of its current status.";
    case 500:
      return "Something went wrong on the server. Please try again later.";
    default:
      return fallbackMessage;
  }
};
