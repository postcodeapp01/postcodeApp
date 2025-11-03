import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store';

interface Category {
  id: number | string;
  name: string;
  image?: string;
  parent_id?: number | string | null;
  parentId?: number | string | null;
  parent?: number | string | null;
  order?: number | string;
  [key: string]: any;
}

interface Props {
  selectedCategoryId: number | string;
  onCategoryChange: (categoryId: number) => void;
}

const ITEM_WIDTH = 70;
const ITEM_SPACING = 6;

const CategorySiblings: React.FC<Props> = ({
  selectedCategoryId,
  onCategoryChange,
}) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const categories: Category[] = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const norm = (val: any) =>
    val === null || typeof val === 'undefined' ? '' : String(val);

  const siblings = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];

    const currentCategory = categories.find(
      (c) => norm(c.id) === norm(selectedCategoryId),
    );
    if (!currentCategory) return [];

    const parent = currentCategory.parent_id ?? currentCategory.parentId ?? currentCategory.parent ?? null;
    const parentNorm = norm(parent);


    const list = categories.filter((c) => {
      const pid = c.parent_id ?? c.parentId ?? c.parent ?? null;
      return norm(pid) === parentNorm;
    });

    // stable sort: by 'order' if present, else by name
    const sorted = [...list].sort((a, b) => {
      if (typeof a.order !== 'undefined' && typeof b.order !== 'undefined') {
        return Number(a.order) - Number(b.order);
      }
      return String(a.name ?? '').localeCompare(String(b.name ?? ''));
    });

    // move selected to front (if present)
    const selectedIndex = sorted.findIndex((c) => norm(c.id) === norm(selectedCategoryId));
    if (selectedIndex > 0) {
      const [selected] = sorted.splice(selectedIndex, 1);
      sorted.unshift(selected);
    }

    return sorted;
  }, [categories, selectedCategoryId]);

  if (!siblings || siblings.length <= 1) return null;

  const handlePress = (id: number | string) => {
    if (norm(id) === norm(selectedCategoryId)) return;
    onCategoryChange(Number(id));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {siblings.map((cat) => {
          const isSelected = norm(cat.id) === norm(selectedCategoryId);
          return (
            <TouchableOpacity
              key={String(cat.id)}
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => handlePress(cat.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.imageWrap, isSelected && styles.imageWrapSelected]}>
                {cat.image ? (
                  <Image
                    source={{ uri: cat.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>
                      {(cat.name ?? '')[0] ?? '•'}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategorySiblings;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height:120,
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  item: {
    width: ITEM_WIDTH,
    marginRight: ITEM_SPACING,
    alignItems: 'center',
  },
  itemSelected: {},
  imageWrap: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageWrapSelected: {
    borderWidth: 2,
    borderColor: '#FF5964',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
  },
  name: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
  nameSelected: {
    fontWeight: '700',
    color: '#111',
  },
});
