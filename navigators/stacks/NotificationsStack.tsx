
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notifications from '../../App/notifications/Notifications';

const Stack = createNativeStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}