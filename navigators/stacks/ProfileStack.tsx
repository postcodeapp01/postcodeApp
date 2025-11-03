
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfile from '../../app/userProfile/UserProfile';
import EditProfile from '../../app/userProfile/screens/EditProfile';
import AddressScreen from '../../app/userProfile/screens/AddressScreen';
import AddAddressScreen from '../../app/userProfile/screens/AddAddressScreen';
import WishlistScreen from '../../app/userProfile/screens/WishlistScreen';
import AboutScreen from '../../app/userProfile/screens/AboutScreen';
import MyOrdersScreen from '../../app/userProfile/screens/MyOrdersScreen';
import OrderTracking from '../../app/userProfile/screens/OrderTracking';
import StoreOrderDetails from '../../app/userProfile/screens/StoreOrderDetails';
import MyStoresScreen from '../../app/userProfile/screens/MyStoresScreen';
import SavedPaymentMethodsScreen from '../../app/userProfile/screens/SavedPaymentMethods';
import HelpAndSupportScreen from '../../app/userProfile/screens/HelpAndSupportScreen';
import ChatSupportScreen from '../../app/userProfile/screens/ChatSupportScreen';
import NotificationsScreen from '../../app/userProfile/screens/NotificationsScreen';
import TermsAndPoliciesScreen from '../../app/userProfile/screens/TermsAndPoliciesScreen';
import AboutTrendRushScreen from '../../app/userProfile/screens/AboutTrendRushScreen';

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
      <Stack.Screen name='StoreOrderDetails' component={StoreOrderDetails} />
      <Stack.Screen name='MyStores' component={MyStoresScreen} />
      <Stack.Screen name='SavedPaymentMethods' component={SavedPaymentMethodsScreen} />
      <Stack.Screen name='HelpAndSupport' component={HelpAndSupportScreen} />
      <Stack.Screen name='ChatSupport' component={ChatSupportScreen} />
      <Stack.Screen name='Notifications' component={NotificationsScreen} />
      <Stack.Screen name='AboutTrendRush' component={AboutTrendRushScreen} />
      <Stack.Screen name='TermsAndPolicies' component={TermsAndPoliciesScreen} />
    </Stack.Navigator>
  );
}