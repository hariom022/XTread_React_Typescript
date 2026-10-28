import { useState } from "react";
import UserListTable from "../components/UserListTable";
import UserRegistrationForm from "../components/UserRegistrationForm";

const UserRegistrationPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <>
      <UserRegistrationForm
        onUserCreated={handleUserCreated}
      />

      <UserListTable refreshKey={refreshKey} />
    </>
  );
};

export default UserRegistrationPage;