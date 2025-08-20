import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CategoryCard from './CategoryCard';
import {RootState} from '../../../../Store';
import {useSelector} from 'react-redux';

const PickByCategory: React.FC = () => {
  const {categories} = useSelector(
    (state: RootState) => state.categories,
  );

  // Level 1 categories
  const womenCategory = categories.find(
    c => c.name === 'Women' && c.level === 1,
  );
  const menCategory = categories.find(c => c.name === 'Men' && c.level === 1);

  // Level 2 subcategories
  const womenSubcategories = categories.filter(
    c => c.parent_id === womenCategory?.id,
  );
  const menSubcategories = categories.filter(
    c => c.parent_id === menCategory?.id,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick By Category</Text>
      <View style={styles.categoryContainer}>
        {/* Women Row */}
        <View style={styles.row}>
          {womenCategory && (
            <CategoryCard
              category={{...womenCategory, subcategory: womenCategory.name}}
              isLarge={true}
              onPress={() => console.log(`Pressed ${womenCategory.name}`)}
            />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}>
            {womenSubcategories.map(category => (
              <View key={category.id} style={styles.cardSpacing}>
                <CategoryCard
                  category={{
                    ...category,
                    subcategory: category.name,
                    category: 'Women',
                  }}
                  isLarge={false}
                  onPress={() => console.log(`Pressed ........${category.name } ${category.id}`)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Men Row */}
        <View style={styles.row}>
          {menCategory && (
            <CategoryCard
              category={{...menCategory, subcategory: menCategory.name}}
              isLarge={true}
              onPress={() => console.log(`Pressed ${menCategory.name}`)}
            />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}>
            {menSubcategories.map(category => (
              <View key={category.id} style={styles.cardSpacing}>
                <CategoryCard
                  category={{
                    ...category,
                    subcategory: category.name,
                    category: 'Men',
                  }}
                  isLarge={false}
                  onPress={() => console.log(`Pressed ${category.name}`)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 221,
    backgroundColor: '#fff',
    padding: 16,
    top: -30,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 16,
  },
  categoryContainer: {
    height: 182,
    flexDirection: 'column',
  },
  row: {
    width: 401,
    height: 86,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 0,
  },
  scrollRow: {
    height: 86,
    width: 401,
    flexDirection: 'row',
    left: 10,
  },
  cardSpacing: {
    marginRight: 6,
  },
});

export default PickByCategory;
