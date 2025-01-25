
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from '../../app/categories/Categories';

const Stack = createNativeStackNavigator();

export default function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesStack" component={Categories} />
    </Stack.Navigator>
  );
}