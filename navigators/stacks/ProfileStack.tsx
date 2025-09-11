
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfile from '../../app/userProfile/UserProfile';
import EditProfile from '../../app/userProfile/screens/EditProfile';
import AddressScreen from '../../app/userProfile/screens/AddressScreen';
import AddAddressScreen from '../../app/userProfile/screens/AddAddressScreen';
import WishlistScreen from '../../app/userProfile/screens/WishlistScreen';
import AboutScreen from '../../app/userProfile/screens/AboutScreen';
import MyOrdersScreen from '../../app/userProfile/screens/MyOrdersScreen';
import OrderTracking from '../../app/userProfile/screens/OrderTracking';

const Stack = createNativeStackNavigator();

export default function UserProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='AddressScreen' component={AddressScreen} />
      <Stack.Screen name='AddAddressScreen' component={AddAddressScreen} />
      <Stack.Screen name='WishlistScreen' component={WishlistScreen} />
      <Stack.Screen name='AboutScreen' component={AboutScreen} />
      <Stack.Screen name='MyOrdersScreen' component={MyOrdersScreen} />
      <Stack.Screen name='OrderTracking' component={OrderTracking} />

    </Stack.Navigator>
  );
}