import { useEffect, useMemo, useState } from "react";
import rejectedTyreServiceApi from "../services/rejectedTyreServiceApi";


const useRejectedTyres = () => {
    const [result, setResult] = useState([]);
    useEffect(() => {
        fetchRejectedTyres();
        
    }, []);
   const fetchRejectedTyres = async () => {
    try {
        var params = {};
        const results = await rejectedTyreServiceApi.getRejectedTyres(params);
        setResult(results.data.data);
    }
    catch (error) {
        throw error;
    }
    };
};
export default useRejectedTyres;