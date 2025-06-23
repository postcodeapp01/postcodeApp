import React, { useState } from "react";
import { View, Text } from "react-native";
import Input from "../common/Input";
import Button from "../common/Button";
import { registerUser, setItemInAsyncStorage, getUserDetails } from "./authServices/AuthServices";
import Loader from "../common/utils/Loader";

export default function SignUp({ route }: { route: any }) {

    const { phone: phoneProp, email: emailProp } = route.params;
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState(emailProp);
    const [phone, setPhone] = useState(phoneProp)
    const [dob, setDob] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleRegistration = () => {
        setIsLoading(true)
        registerUser(userName, phone, email, dob).then((res) => {
            setItemInAsyncStorage('accessToken', res.access_token);
            getUserDetails(res.access_token).then((response) => {
            })
        }).catch((err) => {
            if(err.error) {
                setErrorMessage(errorMessage);
            }
        }).finally(() => setIsLoading(false));
    }


    return (
        <>
            {isLoading ? <Loader /> : null}
            <View>
                <Input label="User Name" onChangeInput={(text) => setUserName(text)} />
                {phoneProp ? (
                    <Input label="Email" onChangeInput={(text) => setEmail(text)} />
                ) : (
                    <Input label="Phone" onChangeInput={(text) => setPhone(text)} />
                )}
                <Input label="Date of birth" onChangeInput={(text) => setDob(text)} />
                <Button type="primary" text="Sign Up" onClick={() => handleRegistration()} />
            </View>
        </>
    )
}