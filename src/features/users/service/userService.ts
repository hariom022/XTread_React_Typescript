import api from "../../../shared/services/api";

const userService={
   getRoles:()=> api.get("/roles"),
   saveUser:(payload:any)=>{return api.post("/users/",payload)}


}
export default userService;