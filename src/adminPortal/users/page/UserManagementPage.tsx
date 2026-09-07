import UserListTable from "../components/UserListTable";
import UserRegistrationForm from "../components/UserRegistrationForm";

const UserRegistrationPage = () => {
  return (
    <>
      <UserRegistrationForm />

      <UserListTable />
    </>
  );
};

export default UserRegistrationPage;