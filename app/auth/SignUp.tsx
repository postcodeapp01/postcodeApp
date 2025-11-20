import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Input from '../common/Input';
import Button from '../common/Button';
import Loader from '../common/utils/Loader';
import {Api} from '../../config/Api';
import {NavigationProp} from './Login';

export default function SignUp({route}: {route: any}) {
  const navigation = useNavigation<NavigationProp>();
  const {phone: phoneProp, email: emailProp} = route.params;
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState(emailProp);
  const [phone, setPhone] = useState(phoneProp);
  // const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const handleRegistration = () => {
  //   setIsLoading(true);
  //   console.log('Entered');
  //   const requestObject = {
  //     phone,
  //     email,
  //     name: userName,
  //   };
  //   fetch(Api.sendOtp, {
  //     method: 'post',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(requestObject),
  //   })
  //     .then(async res => {
  //       if (res.status === 200) {
  //         console.log('Finished in  main');
  //         navigation.navigate('OtpScreen', requestObject);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error while initiating the login', err);
  //       setErrorMessage('Something Went wrong. Please try again later');
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //       console.log('Finished');
  //     });
  // };
  const handleRegistration = async () => {
    setIsLoading(true);
    console.log('[DEBUG] Starting registration with:', {
      phone,
      email,
      userName,
    });

    const requestObject = {phone, email, name: userName};

    try {
      console.log('[DEBUG] Sending OTP request to:', Api.sendOtp);
      const res = await fetch(Api.sendOtp, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestObject),
      });

      console.log('[DEBUG] Raw response status:', res.status);
      const data = await res.json().catch(() => ({}));
      console.log('[DEBUG] Response JSON:', data);

      if (res.ok) {
        console.log(
          '[DEBUG] OTP request successful, navigating to OtpScreen with:',
          requestObject,
        );
        navigation.navigate('OtpScreen', requestObject);
      } else {
        console.error('[ERROR] OTP request failed:', res.status, data);
        setErrorMessage(
          data?.message || 'Failed to send OTP. Please try again.',
        );
      }
    } catch (err) {
      console.error(
        '[ERROR] Network or server error while initiating OTP:',
        err,
      );
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
      console.log('[DEBUG] Finished registration attempt');
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          flex: 1,
          marginVertical: 10,
        }}>
        <Input label="User Name" onChangeInput={text => setUserName(text)} />
        {phoneProp ? (
          <Input label="Email" onChangeInput={text => setEmail(text)} />
        ) : (
          <Input label="Phone" onChangeInput={text => setPhone(text)} />
        )}
        {/* <Input label="Date of birth" onChangeInput={(text) => setDob(text)} /> */}
        <Button
          type="primary"
          text="Sign Up"
          disabled={!email?.length || !phone?.length}
          onClick={() => handleRegistration()}
        />
      </View>
    </>
  );
}








// import React, { useState } from "react";
// import { View, Text, ImageBackground, TextInput, Dimensions } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { LoginStyles } from "../../sources/styles/loginStyles";
// import { sendOtp } from "./authServices/AuthServices";
// import Button from "../common/Button";
// import Divider from "../common/Divider";
// import Loader from "../common/utils/Loader";
// import { CommonStyles } from "../../sources/styles/common";

// const { height } = Dimensions.get('window');

// export type RootStackParamList = {
//     OtpScreen: {
//       name: string | null;
//       phone: string | null;
//       email: string | null;
//     };
//   };

// export type NavigationProp = StackNavigationProp<RootStackParamList, 'OtpScreen'>;

// export default function Login() {
//     const navigation = useNavigation<NavigationProp>();
//     const [userId, setUserId] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('')

//     const renderLogoContainer = () => {
//         return (
//             <View style={LoginStyles.logoContainer}>
//                 <ImageBackground source={require('../../sources/images/logo.png')} style={LoginStyles.logoStyle} />
//                 <Text style={LoginStyles.signInText}>Sign In</Text>
//             </View>
//         )
//     }

//     const handleSignup = () => {
//         setErrorMessage("");
//         const requestObject = {
//             name: null,
//             phone: userId.includes('@') ? null : userId,
//             email: userId.includes('@') ? userId : null
//         }
//         setIsLoading(true);
//         sendOtp(requestObject).then(response => {
//             if(response.statusCode === 429 || response.statusCode === 400) {
//                 setErrorMessage(response.message)
//             } else if(response.statusCode === 200) {
//                 navigation.navigate('OtpScreen', requestObject);
//             }
//         }).catch((err) => {
//             console.log('Error while initiating the login', err);
//             setErrorMessage("Something Went wrong. Please try again later")

//         }).finally(() => setIsLoading(false))
//     }

//     const renderInputContainer = () => {
//         return (
//             <View>
//                 <View>
//                     <Text>Mobile No  / Email</Text>
//                     <TextInput onChangeText={(text) => setUserId(text)} style={LoginStyles.inputBorderContainer} />
//                 </View>
//                 {errorMessage ? <Text style={CommonStyles.errorMessageStyle}>{errorMessage}</Text> : null}
//                 <View>
//                     <Button type="primary" text="Continue" disabled={!userId?.length} onClick={() => handleSignup()} />
//                 </View>
//             </View>
//         )
//     }

//     const renderSocialLoginButtons = () => {
//         return (
//             <View>
//                 <Button text="Continue with Apple" iconName="apple" onClick={() => {}} type="secondary" />
//                 <Button text="Continue with Google" iconName="google" onClick={() => {}} type="secondary" />
//                 <Button text="Continue with Facebook" iconName="facebook" onClick={() => {}} type="secondary" />
//             </View>
//         )
//     }
//     return (
//         <>
//         {isLoading ? <Loader /> : null}
//         <View style={{ backgroundColor: 'white', height }}>
//              <View style={LoginStyles.LoginContainer}>
//                 {renderLogoContainer()}
//                 {renderInputContainer()}
//                 <Divider text="OR" />
//                 {renderSocialLoginButtons()}
//                 <View style={LoginStyles.secondaryTextColor}>
//                     <Text style={{ textAlign: 'center' }}> Already have an account? Sign in</Text>
//                 </View>
//             </View>
//         </View>
//         </>
//     )
// }