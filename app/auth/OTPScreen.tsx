import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OtpInput } from "react-native-otp-entry";
import { validateOtp, registerUser } from "./authServices/AuthServices";
import { useNavigation } from "@react-navigation/native";
import { LoginStyles } from "../../sources/styles/loginStyles";
import Button from "../common/Button";
import { getUserDetails } from "./authServices/AuthServices";
import { updateUserDetails } from "../../reduxSlices/UserSlice";
import { useDispatch } from "react-redux";

const seconds = 30;

export default function OTPScreen({ route }) {
    const [otp, setOtp] = useState();
    const [resendOtpCount, setResendOtpCount] = useState(seconds);
    const [showOtpCount, setShowOtpCount] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { phoneNumber } = route.params;

    useEffect(() => {

          const interval = setInterval(() => {
                    setResendOtpCount((count) => {
                        if(count > 1) {
                            return count - 1
                        } else {
                            clearInterval(interval);
                            setShowOtpCount(false);
                            return seconds;
                        }
                        
                    });
            }, 1000);
        () => {
            clearInterval(interval);
        }
    }, [showOtpCount])

    const handleOtpValidation = (otp: string) => {
        validateOtp(phoneNumber, otp).then((res) => {
            if(res?.access_token) {
                AsyncStorage.setItem('accessToken', res.access_token);
                getUserDetails(res?.access_token).then((response) => {
                    const userData = {
                      isLoggedIn: true,
                      accessToken: res?.access_token,
                      userDetails: response.user
                    }
          
                    dispatch(updateUserDetails(userData));
                  }).catch((err) => {
                    console.log('error while fetching user details', err);
                  })
            } else {
                navigation.navigate('Signup', { phoneNumber: phoneNumber });
            }
        })
    }
    return (
        <View style={LoginStyles.otpContainer}>
            <Text style={LoginStyles.otpTextStyle}> We have sent a Verification code to </Text>
            <Text style={{...LoginStyles.otpTextStyle, fontWeight: '600', marginBottom: 30 }}>{phoneNumber}</Text>
            <OtpInput
                numberOfDigits={6}
                focusColor="green"
                autoFocus={false}
                hideStick={true}
                placeholder=""
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
                theme={{
                    pinCodeContainerStyle: { width: 50, height: 50 }
                }}
            />
            <Text style={[LoginStyles.otpTextStyle, {color: '#476BB9', marginTop: 30 }]}>Check  text message for your OTP</Text>
            <View style={LoginStyles.resendOtpContainer}>
                <Text>Didn't get the OTP? </Text>  
                {showOtpCount ? (
                    <Text style={{ color:'grey' }} onPress={() => setShowOtpCount(true)}>{`Resend SMS in ${resendOtpCount}`} </Text>
                ) : (
                    <Text style={{ color: '#476BB9' }}>Resend OTP</Text>
                )}
            </View>
            <Button type="primary" text="Verify" onClick={() => {}} />
        </View>
    )
}