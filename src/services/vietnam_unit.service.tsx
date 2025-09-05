import axios from "axios";

const VietnamUnitService = {
    getCity : async () => {
        try {
            const response : any = await axios.get(`${process.env.REACT_APP_VIETNAM_API}/?depth=1`)
            return response
        } catch (error) {
            console.error("Error fetching province list:", error);
        }
    },

    getProvice : async (province_code : any) => {
        try {
            const response : any = await axios.get(`${process.env.REACT_APP_VIETNAM_API}/p/${province_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching district list:", error);
        }
    },

    getDistrict : async (district_code : any) => {
        try {
            const response : any = await axios.get(`${process.env.REACT_APP_VIETNAM_API}/d/${district_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching ward list:", error);
        }
    }
}

export default VietnamUnitService