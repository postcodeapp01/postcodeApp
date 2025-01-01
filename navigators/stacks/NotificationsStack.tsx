import { createStackNavigator } from '@react-navigation/stack';
import Notifications from '../../App/notifications/Notifications';

const Stack = createStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}