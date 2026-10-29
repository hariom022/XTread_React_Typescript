
import axios from "axios";

type CementingAction = "save" | "approve";

export const getCementingErrorMessage = (
  error: unknown,
  action: CementingAction,
): string => {
  const fallbackMessage =
    action === "save"
      ? "Unable to save the cement type. Please try again."
      : "Unable to approve this casing. Please try again.";

  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const status = error.response?.status;

  // Inspect known business errors internally, but never display
  // the raw backend message to the user.
  const backendMessage = error.response?.data?.error?.message;

  const message =
    typeof backendMessage === "string"
      ? backendMessage.toLowerCase()
      : "";

  if (
    message.includes("no cement type selected") ||
    message.includes("save before approving")
  ) {
    return "Please save a cement type before approving this casing.";
  }

  if (message.includes("not at cementing stage")) {
    return "This casing is no longer available for cementing. Please refresh the list.";
  }

  if (message.includes("already") && message.includes("cement")) {
    return "The cement type may already be saved. Please reopen the casing and check its saved status.";
  }

  if (status === 400) {
    return action === "save"
      ? "The cement type could not be saved. Please check your selection and try again."
      : "The casing could not be approved. Please check the casing details and try again.";
  }

  if (status === 404) {
    return "The requested casing or cement type could not be found. Please refresh the list.";
  }

  if (status === 409) {
    return "This casing has already been updated. Please refresh the list and try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  if (status !== undefined && status >= 500) {
    return "A server error occurred. Please try again later or contact support.";
  }

  return fallbackMessage;
};

export default getCementingErrorMessage;
