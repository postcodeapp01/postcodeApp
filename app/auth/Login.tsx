import React, { useState } from "react";
import { View, Text, ImageBackground, TextInput, Dimensions } from "react-native";
import { LoginStyles } from "../../sources/styles/loginStyles";
import { Api, domainUrl } from "../../config/Api";
import Button from "../common/Button";
import Divider from "../common/Divider";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get('window');

export default function Login() {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const renderLogoContainer = () => {
        return (
            <View style={LoginStyles.logoContainer}>
                <ImageBackground source={require('../../sources/images/logo.png')} style={LoginStyles.logoStyle} />
                <Text style={LoginStyles.signInText}>Sign In</Text>
            </View>
        )
    }

    const handleSignup = () => {

        navigation.navigate('OtpScreen', { phoneNumber: phoneNumber });
        // fetch(
        //     Api.sendOtp, 
        //     { 
        //         method: 'post',
        //         headers: {
        //             'Accept': 'application/json, text/plain, */*',
        //             'Content-Type': 'application/json'
        //         }, 
        //         body: JSON.stringify({
        //             phone_number: phoneNumber
        //         })
        //     }, 
        // ).then(res => {
        //     if(res.status === 200) {
        //         navigation.navigate('OtpScreen', { phoneNumber: phoneNumber });
        //     }
        // })
        // .then(res => console.log(res)).catch((err) => {
        //     console.log(err, 'hello err')
        // });
    }

    const renderInputContainer = () => {
        return (
            <View>
                <View>
                    <Text>Mobile No / Email</Text>
                    <TextInput onChangeText={(text) => setPhoneNumber(text)} style={LoginStyles.inputBorderContainer} />
                </View>
                <View>
                    <Button type="primary" text="Continue" onClick={() => handleSignup()} />
                </View>
            </View>
        )
    }

    const renderSocialLoginButtons = () => {
        return (
            <View>
                <Button text="Continue with Apple" iconName="apple" onClick={() => {}} type="secondary" />
                <Button text="Continue with Google" iconName="google" onClick={() => {}} type="secondary" />
                <Button text="Continue with Facebook" iconName="facebook" onClick={() => {}} type="secondary" />
            </View>
        )
    }
    return (
        <View style={{ backgroundColor: 'white', height }}>
             <View style={LoginStyles.LoginContainer}>
                {renderLogoContainer()}
                {renderInputContainer()}
                <Divider text="OR" />
                {renderSocialLoginButtons()}
                <View style={LoginStyles.secondaryTextColor}>
                    <Text style={{ textAlign: 'center' }}> Already have an account? Sign in</Text>
                </View>
            </View>
        </View>
    )
}