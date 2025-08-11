import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeStack from './HomeStack';
import Login from '../../app/auth/Login';
import Signup from '../../app/auth/SignUp';
import OTPScreen from '../../app/auth/OTPScreen';
import FlashScreen from '../../app/auth/FlashScreen';
import CustomHeader from '../../app/common/CustomHeader';
import Home from '../../app/home/Home';
import StoreScreen from '../../app/screens/StoreScreen';
import ProductDetails from '../../app/screens/ProductDetails';
import ProductsScreen from '../../app/screens/ProductScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name='FlashScreen' component={FlashScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name='Home' component={HomeStack} options={{ headerShown: false }} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="ProductScreen"
        component={ProductsScreen}
        options={{headerShown: false}}
        /> */}
      <Stack.Screen
        name="OtpScreen"
        component={OTPScreen}
        options={{
          header: () => <CustomHeader title="OTP Verification" />,
        }}
      />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen
        name="StoreScreen"
        component={StoreScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
