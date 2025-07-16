import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Api } from "../../../config/Api";


export async function validateOtp(phone: string, otp: string, email: string) {
    
    try {
        const { data } = await axios.post(Api.validateOtp, {
            phone,
            email, 
            code: otp,
        })

        return data;
    } catch (err) {
        console.log("Error while validating otp", err?.response?.data || err?.message);
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
        const { data } = await axios.get(Api.getUserDetails, 
            { headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    } catch (err) {
        console.log('error while fetching user details', err);
    }
}

export const updateUserDetailsInReducer = () => {

}