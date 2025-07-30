import  Axios from "axios";

import axiosInstance, { Api } from "../../config/Api";

export async function  getAddressDetails() {
    try {
        const { data }  = await axiosInstance.get(Api.address);
        return data;
    } catch(err) {
        console.log(`error while fetching address details`, err);
        return err;
    }
}

export async function getPaginatedAddressList(url:string) {
    try {
        const { data } = await axiosInstance.get(url);
        return data
    } catch(err) {
        console.log(`error while fetching address details`, err);
        throw err;
    }
}

export async function deleteAddress(addressId: string) {
    try {
        const { data } = await axiosInstance.delete(`${Api.address}/${addressId}`);
        return data;
    } catch(err) {
        throw err;
    }
}