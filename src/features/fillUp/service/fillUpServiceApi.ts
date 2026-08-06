import api from "../../../shared/services/api";

const fillUpServiceApi = {

    /**Fillup Type DropDown Api in both Stock management (consumption and wasteage) 
     * and In approval page  */
    getFillUpTypes: () =>
        api.get("/fill-up-types"),
    /**SAVE BUTTON API */
    approveFillUp: (data: any) =>
        api.post(
            "/fill-up/approve-reject",
            data
        ),
};

export default fillUpServiceApi;