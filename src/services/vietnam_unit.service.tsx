import axios from "axios";

const VietnamUnitService = {
    getCity : async () => {
        try {
            const response : any = await axios.get('https://provinces.open-api.vn/api/?depth=1')
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    getProvice : async (provice_code : any) => {
        try {
            const response : any = await axios.get(`https://provinces.open-api.vn/api/p/${provice_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    getDistrict : async (district_code : any) => {
        try {
            const response : any = await axios.get(`https://provinces.open-api.vn/api/d/${district_code}?depth=2`)
            return response
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    }
}

export default VietnamUnitService