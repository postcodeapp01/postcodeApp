import { createStackNavigator } from '@react-navigation/stack';
import JobsScreen from '../../App/jobList/JobList';

const Stack = createStackNavigator();

export default function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Jobs" component={JobsScreen} />
    </Stack.Navigator>
  );
}