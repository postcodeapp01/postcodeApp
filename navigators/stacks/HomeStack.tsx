
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import HomeHeader from '../../app/home/header/HomeHeader';
import LocationMarker from '../../app/address/LocationMarker';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" options={{
        header: () => <HomeHeader />
      }} component={HomeScreen} />
    </Stack.Navigator>
  );
}