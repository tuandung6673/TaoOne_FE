import axios from "axios";

const VietnamUnitService = {
    getCity : async () => {
        try {
            const response : any = await axios.get(`${process.env.REACT_APP_VIETNAM_API}/?depth=1`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    getProvice : async (provice_code : any) => {
        try {
            const response : any = await axios.get(`${process.env.REACT_APP_VIETNAM_API}/p/${provice_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    getDistrict : async (district_code : any) => {
        try {
            const response : any = await axios.get(`${process.env.REACT_APP_VIETNAM_API}/d/${district_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    }
}

export default VietnamUnitService