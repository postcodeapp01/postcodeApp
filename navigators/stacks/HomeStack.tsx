import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../App/home/Home';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}