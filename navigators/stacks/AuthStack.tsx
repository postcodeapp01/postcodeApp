
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../app/auth/Login';
import Signup from '../../app/auth/SignUp';
import OTPScreen from '../../app/auth/OTPScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OtpScreen" component={OTPScreen} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}