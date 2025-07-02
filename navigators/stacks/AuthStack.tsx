
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from './HomeStack';
import Login from '../../app/auth/Login';
import Signup from '../../app/auth/SignUp';
import OTPScreen from '../../app/auth/OTPScreen';
import FlashScreen from '../../app/auth/FlashScreen';
import CustomHeader from '../../app/common/CustomHeader';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name='FlashScreen' component={FlashScreen} options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name='Home' component={HomeStack} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}  />
      <Stack.Screen name="OtpScreen" component={OTPScreen} options={{
        header: () => <CustomHeader title="OTP Verification" />
      }} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}