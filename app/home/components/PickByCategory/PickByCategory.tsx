import React, { useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {categoryData} from './categoryData';
import CategoryCard from './CategoryCard';

const PickByCategory: React.FC = () => {
  const womenCategory = categoryData.find(c => c.subcategory === 'Women');
  const menCategory = categoryData.find(c => c.subcategory === 'Men');

  const womenSubcategories = categoryData.filter(
    c => c.category === 'Women' && c.subcategory !== 'Women',
  );
  const menSubcategories = categoryData.filter(
    c => c.category === 'Men' && c.subcategory !== 'Men',
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick By Category</Text>
      <View style={styles.categoryContainer}>
        {/* Women Row */}
        <View style={styles.row}>
          {womenCategory && (
            <CategoryCard
              category={womenCategory}
              isLarge={true}
              onPress={() => console.log(`Pressed ${womenCategory.subcategory}`)}
            />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}>
            {womenSubcategories.map(category => (
              <View key={category.id} style={styles.cardSpacing}>
                <CategoryCard
                  category={category}
                  isLarge={false}
                  onPress={() => console.log(`Pressed ${category.subcategory}`)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Men Row */}
        <View style={styles.row}>
          {menCategory && (
            <CategoryCard
              category={menCategory}
              isLarge={true}
              onPress={() => console.log(`Pressed ${menCategory.subcategory}`)}
            />
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}>
            {menSubcategories.map(category => (
              <View key={category.id} style={styles.cardSpacing}>
                <CategoryCard
                  category={category}
                  isLarge={false}
                  onPress={() => console.log(`Pressed ${category.subcategory}`)}
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
    marginTop: 0
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
