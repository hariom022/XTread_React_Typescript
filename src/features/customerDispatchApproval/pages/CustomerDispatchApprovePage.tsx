import CustomerDispatchApproval from "../components/CustomerDispatchApproval";

const CustomerDispatchApprovePage = () => {
  const handleBack = () => {
    console.log("Back clicked");

    // Later:
    // navigate("/customer-dispatch-approval");
  };

  const handleClose = () => {
    console.log("Close clicked");

    // Later:
    // navigate("/customer-dispatch-approval");
  };

  return (
    <CustomerDispatchApproval
      orderNo="ORD-20260525-000006"
      onBack={handleBack}
      onClose={handleClose}
    />
  );
};

export default CustomerDispatchApprovePage;