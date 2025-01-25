
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Stores from '../../app/stores/Stores';

const Stack = createNativeStackNavigator();

export default function StoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoresStack" component={Stores} />
    </Stack.Navigator>
  );
}