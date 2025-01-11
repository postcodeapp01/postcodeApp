
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobsScreen from '../../App/jobList/JobList';

const Stack = createNativeStackNavigator();

export default function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Jobs" component={JobsScreen} />
    </Stack.Navigator>
  );
}