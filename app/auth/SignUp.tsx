import React, { useState } from "react";
import { View, Text } from "react-native";
import Input from "../common/Input";
import Button from "../common/Button";
import { registerUser, setItemInAsyncStorage, getUserDetails } from "./authServices/AuthServices";
import { useDispatch } from "react-redux";

export default function SignUp({ route }) {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [location, setLocation] = useState("");

    const handleRegistration = () => {
        const { phoneNumber } = route.params;
        registerUser(userName, phoneNumber, email, dob, location).then((res) => {
            setItemInAsyncStorage('accessToken', res.access_token);
            getUserDetails(res.access_token).then((response) => {
            })
        })
    }
    return (
        <View>
            <Input label="User Name" onChangeInput={(text) => setUserName(text)} />
            <Input label="Email" onChangeInput={(text) => setEmail(text)} />
            <Input label="Date of birth" onChangeInput={(text) => setDob(text)} />
            <Input label="Location" onChangeInput={(text) => setLocation(text)} />
            <Button type="primary" text="Sign Up" onClick={() => handleRegistration()} />
        </View>
    )
}