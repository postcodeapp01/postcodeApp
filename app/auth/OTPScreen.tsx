import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OtpInput } from "react-native-otp-entry";
import { validateOtp, getUserDetails, sendOtp } from "./authServices/AuthServices";
import { useNavigation } from "@react-navigation/native";
import { LoginStyles } from "../../sources/styles/loginStyles";
import Button from "../common/Button";
import { updateUserDetails } from "../../reduxSlices/UserSlice";
import { useDispatch } from "react-redux";
import Loader from "../common/utils/Loader";
import { setItemInAsyncStorage } from "../common/utils/asyncStorage/AsyncStorageUtils";

const RESEND_OTP_SECONDS = 30;

type IOtpScreenRouteParams = {
  phone: string;
  email: string;
  name: string;
};

type IOtpScreenProps = {
  route: {
    params: IOtpScreenRouteParams;
  };
};

const OTPScreen: React.FC<IOtpScreenProps> = ({ route }) => {
  const [otp, setOtp] = useState('');
  const [resendOtpCount, setResendOtpCount] = useState(RESEND_OTP_SECONDS);
  const [showOtpCount, setShowOtpCount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { phone, email, name } = route.params;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showOtpCount) {
      intervalRef.current = setInterval(() => {
        setResendOtpCount(prev => {
          if (prev > 1) return prev - 1;
          clearInterval(intervalRef.current!);
          setShowOtpCount(false);
          return RESEND_OTP_SECONDS;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showOtpCount]);

  const extractErrorMessage = (err: any): string => {
    return err?.data?.message || err?.message || err?.error || "Something went wrong. Please try again later.";
  };

  const handleOtpValidation = async (otpCode: string) => {
    if (otpCode.length < 6) return;
    setIsLoading(true);
    try {
      const res = await validateOtp(phone, otpCode, email);

      if (res.statusCode === 206) {
        navigation.navigate('Signup', { phone, email });
      } else if (res.statusCode === 200) {
        await setItemInAsyncStorage('accessToken', res.data.accessToken);
        await setItemInAsyncStorage('refreshToken', res.data.refreshToken);
        const response = await getUserDetails(res.data.accessToken);

        const userData = {
          isLoggedIn: true,
          accessToken: res.data.accessToken,
          userDetails: response.user,
        };

        dispatch(updateUserDetails(userData));
      }
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await sendOtp({ name, phone, email });

      if (res.data.statusCode === 429 || res.data.statusCode === 400) {
        setErrorMessage(res.data.message);
      } else if (res.data.statusCode === 200) {
        setShowOtpCount(true);
      }
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <View style={LoginStyles.otpContainer}>
        <Text style={LoginStyles.otpTextStyle}>We have sent a Verification code to</Text>
        <Text style={{ ...LoginStyles.otpTextStyle, fontWeight: '600', marginBottom: 30 }}>{phone}</Text>

        <OtpInput
          numberOfDigits={6}
          focusColor="green"
          autoFocus={false}
          hideStick={true}
          blurOnFilled={true}
          disabled={false}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onTextChange={(text) => {
            setOtp(text);
            if (errorMessage) setErrorMessage('');
          }}
          onFilled={(text) => handleOtpValidation(text)}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            pinCodeContainerStyle: { width: 50, height: 50 },
          }}
        />

        {errorMessage && (
          <Text style={{ color: 'red', textAlign: 'center', margin: 10 }}>{errorMessage}</Text>
        )}

        <Text style={[LoginStyles.otpTextStyle, { color: '#476BB9', marginTop: 30 }]}>
          Check text message for your OTP
        </Text>

        <View style={LoginStyles.resendOtpContainer}>
          <Text>Didn't get the OTP? </Text>
          {showOtpCount ? (
            <Text style={{ color: 'grey' }}>{`Resend SMS in ${resendOtpCount}`}</Text>
          ) : (
            <Text
              style={{ color: isLoading ? 'grey' : '#476BB9' }}
              onPress={() => !isLoading && resendOtp()}
            >
              Resend OTP
            </Text>
          )}
        </View>

        <Button
          type="primary"
          text="Verify"
          onClick={() => handleOtpValidation(otp)}
          disabled={otp.length < 6 || isLoading}
        />
      </View>
    </>
  );
};

export default OTPScreen;
