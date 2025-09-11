import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CategorySidebar from '../home/components/More/CategorySidebar';
import CategoryGrid from '../home/components/More/CategoryGrid';
import {useSelector} from 'react-redux';
import {RootState} from '../../Store';
// adjust path to your RootState if needed

/**
 * Assumptions:
 * - Redux state: state.categories.categories is an array of category objects coming from your DB
 *   each category looks like: { id, name, image, parent_id, level, ... } (id can be number)
 * - The More root id is passed as route.params.categoryId when navigating from homepage (you said id 65)
 *   If route param is not provided we fall back to 65.
 *
 * Behavior implemented:
 * - Sidebar shows the second-level categories whose parent_id equals the More id (i.e. level 2 children)
 * - When a sidebar item is selected, the right grid shows sections built from that item's children:
 *     * Each direct child (level 3) becomes a section title
 *     * If that level-3 child has level-4 children, the section items are those level-4 children
 *     * If a level-3 child has no level-4 children, the level-3 itself becomes an item inside its own section
 * - All IDs are normalized to strings for component compatibility
 */

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
  // Redux selector you requested
  const categoriesData: RawCategory[] = useSelector(
    (state: RootState) => state.categories.categories,
  );

  // Root 'More' ID (coming from homepage click). default to 65 if not provided.
  const MORE_ID = route?.params?.categoryId ?? 65;
  const moreIdNum = Number(MORE_ID);

  // Normalizer for different shapes (image vs imageUrl, numeric ids, etc.)
  const normalize = (raw: RawCategory): Category => ({
    id: String(raw.id),
    name: raw.name ?? raw.title ?? 'Untitled',
    imageUrl: raw.imageUrl ?? raw.image ?? '',
    isSelected: false,
    raw,
  });

  // 1) Sidebar entries = immediate children of the More root (parent_id === MORE_ID)
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

  // selected sidebar category (string id). default to first level2 category when available.
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (level2Categories.length === 0) {
      setSelectedCategoryId(null);
      return;
    }
    // keep existing if available, otherwise pick first
    if (
      selectedCategoryId &&
      level2Categories.some(c => c.id === selectedCategoryId)
    )
      return;
    setSelectedCategoryId(level2Categories[0].id);
  }, [level2Categories]);

  // 2) Build sections for the selected level2 category:
  //    each level-3 child becomes a section; if level-3 has level-4 children -> those are items,
  //    otherwise the level-3 itself becomes the single item in that section.
  const currentSections: CategorySection[] = useMemo(() => {
    if (!selectedCategoryId || !Array.isArray(categoriesData)) return [];

    const selIdNum = Number(selectedCategoryId);

    // find all direct children (level 3) of selected category
    const level3 = categoriesData.filter(c => {
      const pid = c.parent_id ?? c.parentId ?? c.parent ?? null;
      return pid !== null && Number(pid) === selIdNum;
    });

    // if there are no level-3 children, fallback: show any categories whose parent points directly to selected (already done),
    // or if none at all, show empty.
    if (level3.length === 0) return [];

    return level3.map(l3 => {
      const l3IdNum = Number(l3.id);

      // find children of level-3 (level 4)
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

      // no level-4 children -> show the level-3 itself as an item in its own section
      return {
        id: `${l3.id}-section`,
        title: l3.name ?? 'Section',
        items: [normalize(l3)],
      };
    });
  }, [categoriesData, selectedCategoryId]);

  // sidebar data with selection flag
  const sidebarWithSelection = level2Categories.map(c => ({
    ...c,
    isSelected: c.id === selectedCategoryId,
  }));

  // handlers
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubCategoryPress = (category: Category) => {
    // navigate to product list by category id (string form)
    console.log('sub category', category.id);
    navigation.navigate('ProductsScreen', {
      id: category.id,
    });
  };

  // If More root not found (no children) show a fallback empty state
  const hasContent =
    sidebarWithSelection.length > 0 && currentSections.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Categories</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}
          onPress={()=>navigation.navigate('WishlistScreen' as never)}
          >
            <Ionicons name="heart-outline" size={22} color="#AAAAAA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('CartScreen' as never)}>
            <Ionicons name="bag-outline" size={22} color="#AAAAAA" />
          </TouchableOpacity>
        </View>
      </View>

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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
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
