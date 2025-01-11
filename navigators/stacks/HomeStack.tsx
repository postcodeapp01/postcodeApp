
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../App/home/Home';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}