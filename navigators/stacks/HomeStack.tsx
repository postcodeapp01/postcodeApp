
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import HomeHeader from '../../app/common/HomeHeader';

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