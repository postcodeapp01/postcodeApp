// app/components/More/CategoryGrid.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import SubCategoryCard from './SubCategoryCard';

type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

type CategorySection = {
  id: string;
  title: string;
  items: Category[];
};

type Props = {
  sections: CategorySection[];
  onSubCategoryPress: (category: Category) => void;
};

const CategoryGrid: React.FC<Props> = ({ sections, onSubCategoryPress }) => {
  const renderSection = (section: CategorySection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.grid}>
        {section.items.map((item) => (
          <SubCategoryCard
            key={item.id}
            category={item}
            onPress={() => onSubCategoryPress(item)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map(renderSection)}
      </ScrollView>
    </View>
  );
};

export default CategoryGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    lineHeight:20,
    letterSpacing:-0.32,
    paddingHorizontal:10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});