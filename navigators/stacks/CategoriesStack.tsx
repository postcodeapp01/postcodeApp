
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from '../../app/categories/Categories';

const Stack = createNativeStackNavigator();

export default function CategoriesStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Show by categories" component={Categories} />
    </Stack.Navigator>
  );
}