import React, { useState } from "react";
import { View, Text, ImageBackground, TextInput, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoginStyles } from "../../sources/styles/loginStyles";
import { Api, domainUrl } from "../../config/Api";
import Button from "../common/Button";
import Divider from "../common/Divider";
import Loader from "../common/utils/Loader";
import { CommonStyles } from "../../sources/styles/common";

const { height } = Dimensions.get('window');

export type RootStackParamList = {
    OtpScreen: {
      name: string | null;
      phone: string | null;
      email: string | null;
    };
  };
  

export type NavigationProp = StackNavigationProp<RootStackParamList, 'OtpScreen'>;


export default function Login() {
    const navigation = useNavigation<NavigationProp>();
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    
    const renderLogoContainer = () => {
        return (
            <View style={LoginStyles.logoContainer}>
                <ImageBackground source={require('../../sources/images/logo.png')} style={LoginStyles.logoStyle} />
                <Text style={LoginStyles.signInText}>Sign In</Text>
            </View>
        )
    }

    const handleSignup = () => {
        setErrorMessage("");
        const requestObject = {
            name: null,
            phone: userId.includes('@') ? null : userId,
            email: userId.includes('@') ? userId : null
        }
        setIsLoading(true);
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
            console.log(response)
            if(response.statusCode === 429 || response.statusCode === 400) {
                setErrorMessage(response.message)
            } else if(res.status === 200) {
                navigation.navigate('OtpScreen', requestObject);
            }
        }).catch((err) => {
            console.log('Error while initiating the login', err);
            setErrorMessage("Something Went wrong. Please try again later")
            
        }).finally(() => setIsLoading(false))
    }

    const renderInputContainer = () => {
        return (
            <View>
                <View>
                    <Text>Mobile No / Email</Text>
                    <TextInput onChangeText={(text) => setUserId(text)} style={LoginStyles.inputBorderContainer} />
                </View>
                {errorMessage ? <Text style={CommonStyles.errorMessageStyle}>{errorMessage}</Text> : null}
                <View>
                    <Button type="primary" text="Continue" disabled={!userId?.length} onClick={() => handleSignup()} />
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
        <>
        {isLoading ? <Loader /> : null}
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
        </>
    )
}