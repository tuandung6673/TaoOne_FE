import axios from "axios";
import { environment } from "../environments/environment";

const VietnamUnitService = {
    getCity : async () => {
        try {
            const response : any = await axios.get(`${environment.vietnamApi}/?depth=1`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    getProvice : async (provice_code : any) => {
        try {
            const response : any = await axios.get(`${environment.vietnamApi}/p/${provice_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    getDistrict : async (district_code : any) => {
        try {
            const response : any = await axios.get(`${environment.vietnamApi}/d/${district_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    }
}

export default VietnamUnitService