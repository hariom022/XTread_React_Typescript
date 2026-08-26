import { useState } from "react";
import type { UserRegistration } from "../types/userRegistration.type";
const UserRegistration = () => {
  const [username, setUsername] = useState<UserRegistration>();
  const [fullname, setFullname] = useState<UserRegistration>();
  const [password, setPassword] = useState<UserRegistration>();
  const [phoneNumber, setPhoneNumber] = useState<UserRegistration>();
  const [email, SetEmail] = useState<UserRegistration>();
  const [role, setRole] = useState<UserRegistration>();
  return (
    <div>
      <form action="">
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="">Full Name</label>
            <input type="text" onChange={()=>setUsername}/>
          </div>
          <div className="col-md-4">
            <label htmlFor="">Username</label>
            <input type="text" />
          </div>
          <div className="col-md-4">
            <label htmlFor="">Password</label>
            <input type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="">Phone Number</label>
            <input type="text" />
          </div>
          <div className="col-md-4">
            <label htmlFor="">Email</label>
            <input type="text" />
          </div>
          <div className="col-md-4">
            <label htmlFor="">Role</label>
            <select name="" id="">
              <option value="" selected>
                Select Role
              </option>
            </select>
          </div>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};
export default UserRegistration;
