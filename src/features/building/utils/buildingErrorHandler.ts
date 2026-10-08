export const getBuildingErrorMessage = (
    error: any,
    fallbackMessage: string
): string => {
    console.error("BUILDING API ERROR:", error);

    const status = error?.response?.status;
    const apiError = error?.response?.data?.error;

    /*
     * BUSINESS ERROR
     *
     * This includes:
     * - BOM errors
     * - Material errors
     * - Width/business rule errors
     * - Pattern/business rule errors
     * - Other Building approval business rules
     */
    if (
        status === 400 &&
        apiError?.code === "BUSINESS_ERROR"
    ) {
        const backendMessage =
            apiError?.message?.toLowerCase() || "";

        if (
            backendMessage.includes("bom") ||
            backendMessage.includes("bom line")
        ) {
            return "Required material BOM configuration is not available for this order. Please contact the administrator.";
        }

        if (
            backendMessage.includes("material") ||
            backendMessage.includes("rubber")
        ) {
            return "Required material configuration is not available for this order. Please contact the administrator.";
        }

        if (
            backendMessage.includes("width")
        ) {
            return "The selected width cannot be used for this order. Please verify the width configuration.";
        }

        if (
            backendMessage.includes("pattern") ||
            backendMessage.includes("tread pattern")
        ) {
            return "The required tread pattern configuration is not available for this order. Please contact the administrator.";
        }

        return "The order could not be approved because a required business configuration is not available. Please contact the administrator.";
    }
    /*
     * ORDER / DATA NOT FOUND
     */
    if (
        status === 404 &&
        apiError?.code === "NOT_FOUND"
    ) {
        return "The required order information could not be found. Please refresh the page and try again.";
    }

    /*
     * UNAUTHORIZED
     *
     * Usually handled globally by your auth/API layer,
     * but keeping it here makes the Building module safe.
     */
    if (status === 401) {
        return "Your session has expired. Please login again.";
    }

    /*
     * FORBIDDEN
     */
    if (status === 403) {
        return "You do not have permission to perform this action.";
    }

    /*
     * CONFLICT
     */
    if (status === 409) {
        return "This order cannot be processed because its current status has changed.";
    }

    /*
     * SERVER ERROR
     */
    if (status >= 500) {
        return "The server is currently unable to process the request. Please try again later.";
    }

    /*
     * NETWORK ERROR
     */
    if (
        error?.code === "ERR_NETWORK" ||
        error?.message === "Network Error"
    ) {
        return "Unable to connect to the server. Please check your network connection.";
    }

    /*
     * TIMEOUT
     */
    if (error?.code === "ECONNABORTED") {
        return "The request took too long to complete. Please try again.";
    }

    /*
     * UNKNOWN ERROR
     */
    return fallbackMessage;
};