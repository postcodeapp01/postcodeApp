import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Store';
import ProductsHeader from '../components/Products/ProductsHeader';
import CategoriesScroll from '../../common/CategoriesScroll';

type Params = {
  CategoryScreen: {
    id: number;
    title?: string;
    image?: string;
  };
};

const {width} = Dimensions.get('window');
const NUM_COLUMNS = 3;
const GAP = 12;
const ITEM_WIDTH = Math.floor((width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS);

const CategoryScreen: React.FC = () => {
  const route = useRoute<RouteProp<Params, 'CategoryScreen'>>();
  const navigation = useNavigation<NavigationProp<any>>();
  const {id, title} = route.params || ({} as any);

  const {categories} = useSelector((s: RootState) => s.categories);

  const thirdLevel = useMemo(
    () => categories.filter((c: any) => c.parent_id === id && c.level === 3),
    [categories, id],
  );

  const handleOpenProducts = (cid: number) =>
    navigation.navigate('ProductsScreen', {id: cid});

  return (
    <View style={styles.container}>
      <ProductsHeader title={title} onBack={() => navigation.goBack()} />

      {/* Only render the horizontal categories scroll */}
      <CategoriesScroll
        items={thirdLevel}
        onItemPress={item => handleOpenProducts(item.id)}
        // backgroundColor="#C3D9F6"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default CategoryScreen;
