import React from "react";
import { View, Text, ImageBackground, TextInput, Dimensions } from "react-native";
import { LoginStyles } from "../../sources/styles/loginStyles";
import { Api, domainUrl } from "../../config/Api";
import Button from "../common/Button";
import Divider from "../common/Divider";

const { height } = Dimensions.get('window');

const data = {
    username: "NikhilManne",
    password: "password123",
    email: "manne.nikhil.1996@gmail.com",
    phone_number: "9966554820"
  }

export default function Login() {
    
    const renderLogoContainer = () => {
        return (
            <View style={LoginStyles.logoContainer}>
                <ImageBackground source={require('../../sources/images/logo.png')} style={LoginStyles.logoStyle} />
                <Text style={LoginStyles.signInText}>Sign In</Text>
            </View>
        )
    }

    const handleSignup = () => {
        console.log('in handle signup', domainUrl + Api.signup)
        fetch(
            domainUrl + Api.signup, 
            { 
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            }, 
        ).then(res => res.json())
        .then(res => console.log(res)).catch((err) => {
            console.log(err, 'hello err')
        });
    }

    const renderInputContainer = () => {
        return (
            <View>
                <View>
                    <Text>Mobile No / Email</Text>
                    <TextInput  style={LoginStyles.inputBorderContainer} />
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