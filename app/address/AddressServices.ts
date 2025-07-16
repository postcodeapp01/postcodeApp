import  Axios from "axios";
import { Api } from "../../config/Api";

export async function  getAddressDetails(accessToken: string) {
    console.log(accessToken, 'heey')
    try {
        const { data }  = await Axios.get(Api.address, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return data;
    } catch(err) {
        console.log(`error while fetching address details`, err);
        return err;
    }
}