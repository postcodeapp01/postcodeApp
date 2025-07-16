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
import Loader from "../common/utils/Loader";
import { Api } from "../../config/Api";

const seconds = 30;

type IOtpScreenProps = {
    route: any;
}

export default function OTPScreen({ route }: IOtpScreenProps) {
    const [otp, setOtp] = useState<string>('');
    const [resendOtpCount, setResendOtpCount] = useState(seconds);
    const [showOtpCount, setShowOtpCount] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { phone, email, name } = route.params;

    useEffect(() => {
        let interval;
        if (showOtpCount) {
            interval = setInterval(() => {
                setResendOtpCount((count) => {
                    if (count > 1) {
                        return count - 1;
                    } else {
                        clearInterval(interval);
                        setShowOtpCount(false);
                        return 30;
                    }
                });
            }, 1000);
        }
    
        return () => clearInterval(interval);
    }, [showOtpCount]);
    
    

    const handleOtpValidation = (otp: string) => {
        setIsLoading(true);
        validateOtp(phone, otp, email).then((res) => {
            if(res?.statusCode === 206) {
                navigation.navigate('Signup', { phone, email });
            } else if(res?.statusCode === 200) {
                console.log(res?.data?.accessToken, 'created accessToken')
                AsyncStorage.setItem('accessToken', res?.data?.accessToken);

                getUserDetails(res?.accessToken).then((response) => {
                    const userData = {
                      isLoggedIn: true,
                      accessToken: res?.access_token,
                      userDetails: response.user
                    }
          
                    dispatch(updateUserDetails(userData));
                  }).catch((err) => {
                    console.log('error while fetching user details', err);
                  })
            } else if(res.error) {
                setErrorMessage(res.error)
            } else if(res.message) {
                setErrorMessage(res.message)
            } 
        }).catch((err) => {
            console.log("Error while validating OTP", err);
        }).finally(() => setIsLoading(false))
    }

    const resendOtp = () => {
        setIsLoading(true);
        const requestObject = {
            name,
            phone,
            email
        }
        fetch(
            Api.sendOtp, 
            { 
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(requestObject)
            }, 
        ).then(async res => {
            const response = await res.json();
            if(response.statusCode === 429 || response.statusCode === 400) {
                setErrorMessage(response.message)
            } else if(response.statusCode === 200) {
                setShowOtpCount(true);
            }
        }).catch((err) => {
            console.log("error occured while resending the otp", err);
        }).finally(() => setIsLoading(false));
    }

    return (
        <>
        {isLoading ? <Loader /> : null}
        <View style={LoginStyles.otpContainer}>
            <Text style={LoginStyles.otpTextStyle}> We have sent a Verification code to </Text>
            <Text style={{...LoginStyles.otpTextStyle, fontWeight: '600', marginBottom: 30 }}>{phone}</Text>
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
                onTextChange={(text) => {setOtp(text); if(errorMessage) setErrorMessage('')}}
                onFilled={(text) => handleOtpValidation(text)}
                textInputProps={{
                    accessibilityLabel: "One-Time Password",
                }}
                theme={{
                    pinCodeContainerStyle: { width: 50, height: 50 }
                }}
            />
            {errorMessage ? <Text style={{ color: 'red', textAlign: 'center', margin: 10 }}>{errorMessage}</Text> : null}
            <Text style={[LoginStyles.otpTextStyle, {color: '#476BB9', marginTop: 30 }]}>Check  text message for your OTP</Text>
            <View style={LoginStyles.resendOtpContainer}>
                <Text>Didn't get the OTP? </Text>  
                {showOtpCount ? (
                    <Text style={{ color:'grey' }}>{`Resend SMS in ${resendOtpCount}`} </Text>
                ) : (
                    <Text style={{ color: '#476BB9' }} onPress={() => resendOtp()}>Resend OTP</Text>
                )}
            </View>
            <Button type="primary" text="Verify" onClick={() => handleOtpValidation(otp)} />
        </View>
        </>
    )
}