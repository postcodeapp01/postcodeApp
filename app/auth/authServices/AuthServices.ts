import AsyncStorage from "@react-native-async-storage/async-storage";
import { Api } from "../../../config/Api";


export async function validateOtp(phone: string, otp: string, email: string) {
    try {
        const response = await fetch(Api.validateOtp, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                email, 
                code: otp,
            })
        })
        const res = await response.json();

        return res;
    } catch (err) {
        console.log("Error while validating otp", err);
    }
}

export function setItemInAsyncStorage(key: string, value: string) {
    AsyncStorage.setItem(key, value);
}

export async function  getItemFromAsyncStorag(key: string) {
    return await AsyncStorage.getItem(key);
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
        const response = await fetch(Api.getUserDetails, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const res = await response.json();
        return res;
    } catch (err) {
        console.log('error while fetching user details', err);
    }
}

export const updateUserDetailsInReducer = () => {

}