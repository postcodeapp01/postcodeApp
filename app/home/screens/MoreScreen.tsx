import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import CategoryGrid from '../homePageComponents/More/CategoryGrid';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Store';
import CategorySidebar from '../homePageComponents/More/CategorySidebar';
import ProductsHeader from '../components/Products/ProductsHeader';

type RawCategory = {
  id: number | string;
  name?: string;
  image?: string;
  imageUrl?: string;
  parent_id?: number | string;
  parentId?: number | string;
  parent?: number | string;
  level?: number;
  [k: string]: any;
};

type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  isSelected?: boolean;
  raw?: RawCategory;
};

type CategorySection = {
  id: string;
  title: string;
  items: Category[];
};

type Props = {
  navigation: any;
  route?: {params?: {categoryId?: number | string}};
};

const MoreScreen: React.FC<Props> = ({navigation, route}) => {
  const categoriesData: RawCategory[] = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const MORE_ID = route?.params?.categoryId ?? 65;
  const moreIdNum = Number(MORE_ID);
  const normalize = (raw: RawCategory): Category => ({
    id: String(raw.id),
    name: raw.name ?? raw.title ?? 'Untitled',
    imageUrl: raw.imageUrl ?? raw.image ?? '',
    isSelected: false,
    raw,
  });

  const level2Categories: Category[] = useMemo(() => {
    if (!Array.isArray(categoriesData) || categoriesData.length === 0)
      return [];

    return categoriesData
      .filter(c => {
        const pid = c.parent_id ?? c.parentId ?? c.parent ?? null;
        return pid !== null && Number(pid) === moreIdNum;
      })
      .map(normalize);
  }, [categoriesData, moreIdNum]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (level2Categories.length === 0) {
      setSelectedCategoryId(null);
      return;
    }
    if (
      selectedCategoryId &&
      level2Categories.some(c => c.id === selectedCategoryId)
    )
      return;
    setSelectedCategoryId(level2Categories[0].id);
  }, [level2Categories]);

  const currentSections: CategorySection[] = useMemo(() => {
    if (!selectedCategoryId || !Array.isArray(categoriesData)) return [];

    const selIdNum = Number(selectedCategoryId);
    const level3 = categoriesData.filter(c => {
      const pid = c.parent_id ?? c.parentId ?? c.parent ?? null;
      return pid !== null && Number(pid) === selIdNum;
    });

    if (level3.length === 0) return [];

    return level3.map(l3 => {
      const l3IdNum = Number(l3.id);

      const level4 = categoriesData.filter(c => {
        const pid = c.parent_id ?? c.parentId ?? c.parent ?? null;
        return pid !== null && Number(pid) === l3IdNum;
      });

      if (level4.length > 0) {
        return {
          id: String(l3.id),
          title: l3.name ?? 'Section',
          items: level4.map(normalize),
        };
      }

      return {
        id: `${l3.id}-section`,
        title: l3.name ?? 'Section',
        items: [normalize(l3)],
      };
    });
  }, [categoriesData, selectedCategoryId]);
  const sidebarWithSelection = level2Categories.map(c => ({
    ...c,
    isSelected: c.id === selectedCategoryId,
  }));

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubCategoryPress = (category: Category) => {
    console.log('sub category', category.id);
    navigation.navigate('ProductsScreen', {
      id: category.id,
    });
  };
  const hasContent =
    sidebarWithSelection.length > 0 && currentSections.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <ProductsHeader title="Categories" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        {/* Left Sidebar - only level2 categories of More */}
        <CategorySidebar
          categories={sidebarWithSelection}
          selectedCategoryId={selectedCategoryId ?? ''}
          onCategorySelect={handleCategorySelect}
        />

        {/* Right Content Grid - show subCategories (sections) for selected level2 */}
        <View style={styles.gridContainer}>
          {hasContent ? (
            <CategoryGrid
              sections={currentSections}
              onSubCategoryPress={handleSubCategoryPress}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No categories found under More.
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoreScreen;
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  gridContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});
