
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

type Category = {
  id: string;
  name: string;
  imageUrl: string;
  isSelected?: boolean;
};

type Props = {
  categories: Category[];
  selectedCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
};

const CategorySidebar: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  const renderCategoryItem = (category: Category) => {
    const isSelected = category.id === selectedCategoryId;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategory
        ]}
        onPress={() => onCategorySelect(category.id)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryImageContainer}>
          <Image 
            source={{ uri: category.imageUrl }}
            style={styles.categoryImage}
            defaultSource={require('../../../../sources/images/c1.png')}
          />
        </View>
        <Text 
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText
          ]}
          numberOfLines={2}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sidebar}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>
    </View>
  );
};

export default CategorySidebar;



const styles = StyleSheet.create({
  sidebar: {
    width: 120,
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#FF3366',
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedCategoryText: {
    color: '#282C3F',
    fontWeight: '600',
  },
});