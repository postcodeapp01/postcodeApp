import { createStackNavigator } from '@react-navigation/stack';
import Login from '../../app/auth/Login';
import Signup from '../../app/auth/SignUp';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="signup" component={Signup} />
    </Stack.Navigator>
  );
}