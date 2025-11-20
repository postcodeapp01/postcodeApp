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


import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {sendOtp} from './authServices/AuthServices';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export type RootStackParamList = {
  OtpScreen: {
    name: string | null;
    phone: string | null;
    email: string | null;
  };
};

export type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'OtpScreen'
>;

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('+91');
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);

  const isPhoneValid = (p: string) => {
    const digitsOnly = p.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const isEmailValid = (e: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(e).toLowerCase());
  };

  const handleToggleInputMode = () => {
    setErrorMessage('');
    setIsEmailMode(prev => !prev);
    setPhoneNumber('');
  };

  const handleSignup = async () => {
    if (isLoading) return;

    setErrorMessage('');
    if (!isEmailMode) {
      if (!phoneNumber || !isPhoneValid(phoneNumber)) {
        setErrorMessage('Please enter a valid 10 digit phone number.');
        return;
      }
    } else {
      if (!phoneNumber || !isEmailValid(phoneNumber)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
    }

    const requestObject = isEmailMode
      ? {name: null, phone: null, email: phoneNumber.trim()}
      : {
          name: null,
          phone: `${countryCode}${phoneNumber.replace(/\D/g, '')}`,
          email: null,
        };

    setIsLoading(true);
    try {
      const response = await sendOtp(requestObject);
      const status =
        response?.statusCode ??
        response?.status ??
        (response && (response.status as number)) ??
        200;
      const message = response?.message ?? response?.data?.message ?? null;

      if (status === 200) {
        navigation.navigate('OtpScreen', requestObject);
      } else if (status === 429 || status === 400) {
        setErrorMessage(message ?? 'Too many requests or invalid input.');
      } else {
        setErrorMessage(message ?? 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('Error while initiating the login', err);
      setErrorMessage(
        err?.response?.data?.message ??
          err?.message ??
          'Something went wrong. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const rightSocialIcon = isEmailMode ? (
    <Icon name="call" size={28} color="#333" />
  ) : (
    <MaterialCommunityIcons name="email" size={28} color="#333" />
  );

  const continueDisabled = isLoading
    ? true
    : isEmailMode
    ? !isEmailValid(phoneNumber)
    : !isPhoneValid(phoneNumber);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandSection}>
          <MaskedView
            maskElement={
              <Text
                style={[styles.brandName, {backgroundColor: 'transparent'}]}>
                TrendRush
              </Text>
            }>
            <LinearGradient
              colors={['#FF5964', '#306CFE']}
              start={{x: 1, y: 1}}
              end={{x: 1, y: 0}}>
              <Text style={[styles.brandName, {opacity: 0}]}>TrendRush</Text>
            </LinearGradient>
          </MaskedView>

          <Text style={styles.tagline}>
            Fast fashion, delivered in an hour.
          </Text>
        </View>

        <View style={styles.headerSection}>
          <View style={styles.dividerLine} />
          <Text style={styles.headerText}>Login or Sign up</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.phoneInputContainer}>
          {!isEmailMode && (
            <TouchableOpacity style={styles.countrySelector} activeOpacity={0.8}>
              <Image
                source={require('../../sources/images/flag-india.png')}
                style={styles.countryFlag}
              />
              <Icon name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          )}

          {!isEmailMode && <Text style={styles.countryCode}>{countryCode}</Text>}

          <TextInput
            style={styles.phoneInput}
            placeholder={isEmailMode ? 'Enter Email Address' : 'Enter Phone Number'}
            placeholderTextColor="#B1B1B1"
            keyboardType={isEmailMode ? 'email-address' : 'phone-pad'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={isEmailMode ? 254 : 14}
            editable={!isLoading}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {errorMessage ? <Text style={{color: 'red', marginBottom: 8}}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[
            styles.continueButton,
            continueDisabled && styles.disabledButton,
          ]}
          onPress={handleSignup}
          activeOpacity={0.8}
          disabled={continueDisabled}>
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Sending OTP...' : isEmailMode ? 'Continue with Email' : 'Continue'}
          </Text>
        </TouchableOpacity>

        <View style={styles.orSection}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Alert.alert('Not implemented', 'Google Login')}
            activeOpacity={0.7}>
            <Image
              source={require('../../sources/images/google.png')}
              style={styles.countryFlag}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleToggleInputMode}
            activeOpacity={0.7}>
            {rightSocialIcon}
          </TouchableOpacity>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text
              style={styles.linkText}
              onPress={() => console.log('Pressed on terms of services')}>
              Terms of Service
            </Text>{' '}
            &{' '}
            <Text
              style={styles.linkText}
              onPress={() => console.log('Privacy policy')}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 155,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 120,
  },
  brandName: {
    fontSize: 40,
    fontWeight: '500',
    color: '#fff',
  },
  tagline: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ABABAB',
  },

  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },

  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#B1B1B1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 25,
  },

  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 4,
  },

  countryFlag: {
    width: 28,
    height: 28,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#B1B1B1',
  },

  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
  continueButton: {
    backgroundColor: '#FF5964',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  disabledButton: {
    backgroundColor: '#fba0a9ff',
  },

  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  orSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ABABAB',
  },

  orText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },

  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },

  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ABABAB',
  },

  termsSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  termsText: {
    fontSize: 14,
    color: '#3B3A3A',
    textAlign: 'center',
    lineHeight: 20,
  },

  linkText: {
    color: '#9B59B6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Login;
