import  Axios from "axios";

import axiosInstance, { Api } from "../../config/Api";

export async function  getAddressDetails(accessToken: string) {
    try {
        const { data }  = await axiosInstance.get(Api.address);
        return data;
    } catch(err) {
        console.log(`error while fetching address details`, err);
        return err;
    }
}