import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeStack from './HomeStack';
import Login from '../../app/auth/Login';
import Signup from '../../app/auth/SignUp';
import OTPScreen from '../../app/auth/OTPScreen';
import HeaderWithNoIcons from '../../app/userProfile/components/Profile/HeaderWithNoIcons';
import { useNavigation } from '@react-navigation/native';



const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const navigation=useNavigation();
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name='FlashScreen' component={FlashScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      
        <Stack.Screen name='Home' component={HomeStack} options={{ headerShown: false }} />
      <Stack.Screen
        name="OtpScreen"
        component={OTPScreen}
        options={{
          header: () => <HeaderWithNoIcons title='OTP Verification' onBack={() => navigation.goBack()} />,
        }}
      />
      <Stack.Screen name="Signup" component={Signup} />
      
    </Stack.Navigator>
  );
}
