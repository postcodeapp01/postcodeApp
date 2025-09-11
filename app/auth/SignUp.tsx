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
