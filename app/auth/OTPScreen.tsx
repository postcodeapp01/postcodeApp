import React, { useState } from "react";
import { Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OtpInput } from "react-native-otp-entry";
import { validateOtp, registerUser } from "./authServices/AuthServices";
import { useNavigation } from "@react-navigation/native";

export default function OTPScreen({ route }) {
    const [otp, setOtp] = useState();
    const navigation = useNavigation();

    const handleOtpValidation = (otp) => {
        const { phoneNumber } = route.params;
        validateOtp(phoneNumber, otp).then((res) => {
            console.log(res, 'hello otp');
            if(res?.access_token) {
                // navigate to home
                AsyncStorage.setItem('accessToken', res.access_token);

            } else {
                navigation.navigate('Signup', { phoneNumber: phoneNumber });
            }
        })
    }
    return (
        <View>
            <OtpInput
                numberOfDigits={6}
                focusColor="green"
                autoFocus={false}
                hideStick={true}
                placeholder="******"
                blurOnFilled={true}
                disabled={false}
                type="numeric"
                secureTextEntry={false}
                focusStickBlinkingDuration={500}
                onFocus={() => console.log("Focused")}
                onBlur={() => console.log("Blurred")}
                onTextChange={(text) => setOtp(text)}
                onFilled={(text) => handleOtpValidation(text)}
                textInputProps={{
                    accessibilityLabel: "One-Time Password",
                }}
            />
        </View>
    )
}