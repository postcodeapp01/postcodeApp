
import axiosInstance from "../../../config/Api";
import { Api } from "../../../config/Api";


export async function validateOtp(phone: string, otp: string, email: string) {
    
    try {
        const { data } = await axiosInstance.post(Api.validateOtp, {
            phone,
            email, 
            code: otp,
        })
        return data;
    } catch (err: any) {
        throw err?.data; 
    }
}

export async function registerUser(userName: string, phoneNumber: string, email: string, dob: string) {
    console.log(phoneNumber, userName, email, dob)
    try {
        const response = await fetch(Api.register, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    name: userName,
                    phone: phoneNumber,
                    email
            })
        })
        const res = await response.json();

        return res;
    } catch (err) {
        console.log('Error while registering the user', err);
    }

}

export async function getUserDetails(accessToken: string) {
    try {
        const { data } = await axiosInstance.get(Api.getUserDetails, 
             { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        });
        return data;
    } catch (err) {
        console.log('error while fetching user details', err);
    }
}

export async function sendOtp(requestObj: { email: string | null, phone: string | null, name: string | null}) {
    try {
        const { data } = await axiosInstance.post(Api.sendOtp, requestObj);
        return data;
    } catch(err: any) {
        throw err?.data
    }
}