import React, { useState } from "react";
import { View, Text, ImageBackground, TextInput, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoginStyles } from "../../sources/styles/loginStyles";
import { sendOtp } from "./authServices/AuthServices";
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
        sendOtp(requestObject).then(response => {
            if(response.statusCode === 429 || response.statusCode === 400) {
                setErrorMessage(response.message)
            } else if(response.statusCode === 200) {
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





// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {sendOtp} from './authServices/AuthServices';
// import Button from '../common/Button';
// import Loader from '../common/utils/Loader';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const {height, width} = Dimensions.get('window');

// export type RootStackParamList = {
//   OtpScreen: {
//     name: string | null;
//     phone: string | null;
//     email: string | null;
//   };
// };

// export type NavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'OtpScreen'
// >;

// export default function Login() {
//   const navigation = useNavigation<NavigationProp>();
//   const [userId, setUserId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSignup = () => {
//     setErrorMessage('');
//     const requestObject = {
//       name: null,
//       phone: userId.includes('@') ? null : userId,
//       email: userId.includes('@') ? userId : null,
//     };
//     setIsLoading(true);
//     sendOtp(requestObject)
//       .then(response => {
//         if (response.statusCode === 429 || response.statusCode === 400) {
//           setErrorMessage(response.message);
//         } else if (response.statusCode === 200) {
//           navigation.navigate('OtpScreen', requestObject);
//         }
//       })
//       .catch(err => {
//         console.log('Error while initiating the login', err);
//         setErrorMessage('Something Went wrong. Please try again later');
//       })
//       .finally(() => setIsLoading(false));
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <View style={{backgroundColor: '#fff', flex: 1}}>
//         {/* Top Illustration Section */}
//         <View style={styles.topSection}>
//           <View style={styles.top}>
//             <Image
//               source={require('../../sources/images/loginPage.png')}
//               style={styles.illustration}
//               resizeMode="contain"
//             />
//           </View>
//         </View>

//         {/* White Card Section */}
//         <View style={styles.cardContainer}>
//           <Text style={styles.smallTitle}>Log in or sign up</Text>
//           <Text style={styles.mainTitle}>Welcome to TrendRush</Text>

//           {/* Phone Input Row */}
//           <View style={styles.inputRow}>
//             <View style={styles.flagContainer}>
//               <TouchableOpacity style={styles.countryPicker}>
//                 <Image
//                   source={require('../../sources/images/flag-india.png')}
//                   style={styles.flag}
//                 />
//                 <Icon name="chevron-down" size={16} color="#555" />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.inputConatiner}>
//               <TextInput
//                 placeholder="+91 Enter Phone Number"
//                 keyboardType="phone-pad"
//                 style={styles.phoneInput}
//                 onChangeText={setUserId}
//               />
//             </View>
//           </View>

//           {errorMessage ? (
//             <Text style={styles.errorMessage}>{errorMessage}</Text>
//           ) : null}

//           {/* Continue Button */}
//           <Button
          
//             text="Continue"
//             onClick={handleSignup}
//             disabled={!userId?.length}
//           />

//           {/* Divider */}
//           <View style={styles.dividerRow}>
//             <View style={styles.divider} />
//             <Text style={styles.dividerText}>Or</Text>
//             <View style={styles.divider} />
//           </View>

//           {/* Social Buttons */}
//           <View style={styles.socialRow}>
//             <TouchableOpacity style={styles.socialButton}>
//               <Image
//                 source={require('../../sources/images/super-g.png')}
//                 style={styles.socialIcon}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialButton}>
//               <Image
//                 source={require('../../sources/images/Facebook.png')}
//                 style={styles.socialIcon}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   topSection: {
//     backgroundColor: '#FF5C5C',
//   },
//   top: {
//     height: height * 0.35,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 160,
//   },
//   illustration: {
//     marginTop: 50,
//     width: '100%',
//     height: '100%',
//   },
//   cardContainer: {
//     height: 311,
//     backgroundColor: '#fff',
//     marginTop: -120,
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//     flex: 1,
//   },
//   smallTitle: {
//     textAlign: 'center',
//     color: '#222222',
//     fontSize: 12,
//     marginBottom: 20,
//     fontWeight: '500',
//   },
//   mainTitle: {
//     textAlign: 'center',
//     fontWeight: '500',
//     color: '#0000000',
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // borderWidth: 1,
//     // borderColor: '#ccc',
//     // borderRadius: 8,
//     overflow: 'hidden',
//     marginBottom: 20,
//     gap: 14.68,
//   },
//   flagContainer: {
//     width: 68,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 48,
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: '#B1B1B1',
//   },
//   inputConatiner: {
//     flex: 1,
//     height: 48,
//     width:289.32,
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: '#B1B1B1',
//   },

//   countryPicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//   },
//   flag: {
//     width: 24,
//     height: 16,
//     marginRight: 4,
//     resizeMode: 'cover',
//   },
//   phoneInput: {
//     flex: 1,
//     color: 'black',
//     paddingHorizontal: 10,
//   },
//   errorMessage: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 10,
//   },
//   dividerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   dividerText: {
//     marginHorizontal: 8,
//     color: '#666',
//     fontSize: 12,
//   },
//   socialRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 20,
//   },
//   socialButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//   },
//   socialIcon: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
// });
