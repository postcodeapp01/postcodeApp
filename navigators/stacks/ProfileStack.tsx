
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfile from '../../app/userProfile/UserProfile';
const Stack = createNativeStackNavigator();

export default function UserProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoresStack" component={UserProfile} />
    </Stack.Navigator>
  );
}