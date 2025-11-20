import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';

type Category = {
  id: number;
  name: string;
  image?: string;
  level: number;
  parent_id: number | null;
};

type CategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (selected: Record<string, string[]>) => void; // returns ids as strings
};

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onApply }) => {
  const categoriesData: Category[] = useSelector(
    (state: RootState) => state.categories.categories
  );

  // first screen selection (Men/Women or Kids' child)
  const [selectedTop, setSelectedTop] = useState<Category | null>(null);

  // active second-level (drives Explore Everything)
  const [activeSecondLevel, setActiveSecondLevel] = useState<Category | null>(null);

  // search for third-level
  const [search, setSearch] = useState('');

  // explicit second-level selections (strings, e.g. ["20", "7"])
  const [selectedSecond, setSelectedSecond] = useState<string[]>([]);

  // selected third-level ids grouped by second-level id
  // e.g. { "20": ["24","25"], "7": ["13"] }
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // -------- FIRST SCREEN DATA: Men, Women, Kids children --------
  const men = useMemo(
    () => categoriesData.find(c => c.level === 1 && c.name.toLowerCase() === 'men') || null,
    [categoriesData]
  );
  const women = useMemo(
    () => categoriesData.find(c => c.level === 1 && c.name.toLowerCase() === 'women') || null,
    [categoriesData]
  );
  const kids = useMemo(
    () => categoriesData.find(c => c.level === 1 && c.name.toLowerCase() === 'kids') || null,
    [categoriesData]
  );

  const kidsChildren = useMemo(
    () => categoriesData.filter(c => kids && c.parent_id === kids.id),
    [categoriesData, kids]
  );

  const firstScreenCategories = useMemo(() => {
    const items: Category[] = [];
    if (men) items.push(men);
    if (women) items.push(women);
    items.push(...kidsChildren); // Boys, Girls, Infants, Teens
    return items;
  }, [men, women, kidsChildren]);

  // -------- SUBCATEGORIES DATA (level-2 under selectedTop) --------
  const level2ForSelectedTop = useMemo(() => {
    if (!selectedTop) return [];
    return categoriesData.filter(c => c.parent_id === selectedTop.id);
  }, [categoriesData, selectedTop]);

  // default active second-level when top changes
  useEffect(() => {
    if (level2ForSelectedTop.length > 0) {
      if (!activeSecondLevel || !level2ForSelectedTop.some(x => x.id === activeSecondLevel.id)) {
        setActiveSecondLevel(level2ForSelectedTop[0]);
      }
    } else {
      setActiveSecondLevel(null);
    }
    setSearch('');
  }, [selectedTop, level2ForSelectedTop.length]);

  // level-3 (Explore Everything) under activeSecondLevel
  const level3ForActive = useMemo(() => {
    if (!activeSecondLevel) return [];
    let list = categoriesData.filter(c => c.parent_id === activeSecondLevel.id);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(x => x.name.toLowerCase().includes(q));
    }
    return list;
  }, [categoriesData, activeSecondLevel, search]);

  // -------- SELECTION HANDLERS (logic only — UI unchanged) --------

  // Toggle explicit second-level selection (string id). Also set it active for Explore.
  const onTapTopPick = (second: Category) => {
    const key = String(second.id);

    setActiveSecondLevel(second);

    setSelectedSecond(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // Toggle third-level selection — we store third ids under their second parent.
  // IMPORTANT: when user selects a third-level under a second, we remove that second from selectedSecond
  // so apply will return third-level ids (third-level selections override second-level-only).
  const toggleThirdLevelSelection = (secondId: number, thirdId: number) => {
    const secKey = String(secondId);
    const thirdKey = String(thirdId);

    setSelectedFilters(prev => {
      const current = prev[secKey] || [];
      let next: string[];
      if (current.includes(thirdKey)) {
        next = current.filter(id => id !== thirdKey);
      } else {
        next = [...current, thirdKey];
      }

      // If next is empty we remove the key to keep object tidy
      const copy = { ...prev };
      if (next.length === 0) {
        delete copy[secKey];
      } else {
        copy[secKey] = next;
      }
      return copy;
    });

    // If user is adding a third-level, ensure that second-level-only selection is removed
    // (we want third-level selections to take precedence).
    setSelectedSecond(prev => prev.filter(k => k !== secKey));
  };

  const isThirdSelected = (secondId: number, thirdId: number) => {
    const secKey = String(secondId);
    return (selectedFilters[secKey] || []).includes(String(thirdId));
  };

  const isSecondChecked = (second: Category) => {
    const key = String(second.id);
    const hasChildrenSelected = (selectedFilters[key] || []).length > 0;
    const isExplicitSelected = selectedSecond.includes(key);
    const isActive = activeSecondLevel?.id === second.id;
    return isActive || hasChildrenSelected || isExplicitSelected;
  };

  // Build payload for onApply
  // - level2: second-level ids (strings) explicitly selected with NO third-level selected under them
  // - level3: all third-level ids (strings) selected
  // - plus per-second key mapping to third-level choices
  const buildApplyPayload = (): Record<string, string[]> => {
    const level2Only: string[] = [];
    const level3All: string[] = [];
    const bySecond: Record<string, string[]> = {};

    // second-level explicit selected that have NO third-levels selected under them
    selectedSecond.forEach(secondIdStr => {
      const third = selectedFilters[secondIdStr] || [];
      if (third.length === 0) {
        level2Only.push(secondIdStr);
      }
    });

    // gather third-level selections and group by second-level
    Object.entries(selectedFilters).forEach(([secondId, thirdIds]) => {
      if (thirdIds.length > 0) {
        bySecond[secondId] = [...thirdIds];
        level3All.push(...thirdIds);
      }
    });

    return {
      level2: level2Only,
      level3: level3All,
      ...bySecond,
    };
  };

  // -------------------- RENDERERS (UI kept identical) --------------------
  const renderCategoryList = () => (
    <View style={styles.sheetContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Category</Text>
        <TouchableOpacity onPress={() => onApply(buildApplyPayload())}>
          <Text style={styles.applyAll}>Apply all filters</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={firstScreenCategories}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => setSelectedTop(item)}>
            <Text style={styles.categoryText}>{item.name}</Text>
            <Icon name="chevron-forward" size={18} />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderSubCategory = () => (
    <SafeAreaView style={styles.fullScreenContainer}>
      {/* Header */}
      <View style={styles.subHeader}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTop(null);
            setActiveSecondLevel(null);
            setSearch('');
          }}
        >
          <Icon name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{selectedTop ? selectedTop.name : 'Subcategories'}</Text>

        <TouchableOpacity onPress={() => onApply(buildApplyPayload())}>
          <Text style={styles.applyAll}>Apply all filters</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.subContent} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search for third-level */}
        <TextInput placeholder="Search" style={styles.search} value={search} onChangeText={setSearch} />

        {/* Top Picks: SECOND-LEVEL, checkbox rows like previous UX */}
        <Text style={styles.sectionTitle}>Top Picks</Text>
        {level2ForSelectedTop.length === 0 && (
          <Text style={{ paddingHorizontal: 10, color: '#666' }}>No subcategories found.</Text>
        )}

        {level2ForSelectedTop.map(second => (
          <TouchableOpacity key={second.id} style={styles.checkboxRow} onPress={() => onTapTopPick(second)}>
            <Icon name={isSecondChecked(second) ? 'checkbox' : 'square-outline'} size={20} />
            <Text style={styles.checkboxText}>{second.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Explore Everything: THIRD-LEVEL of active second-level */}
        <Text style={styles.sectionTitle}>Explore Everything</Text>
        {activeSecondLevel && level3ForActive.length === 0 && (
          <Text style={{ paddingHorizontal: 10, color: '#666' }}>No items found.</Text>
        )}

        {activeSecondLevel &&
          level3ForActive.map(third => (
            <TouchableOpacity
              key={third.id}
              style={styles.checkboxRow}
              onPress={() => toggleThirdLevelSelection(activeSecondLevel.id, third.id)}
            >
              <Icon
                name={isThirdSelected(activeSecondLevel.id, third.id) ? 'checkbox' : 'square-outline'}
                size={20}
              />
              <Text style={styles.checkboxText}>{third.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Footer fixed at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            onApply(buildApplyPayload());
            onClose();
          }}
        >
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {selectedTop ? (
        <View style={styles.fullScreenOverlay}>{renderSubCategory()}</View>
      ) : (
        <View style={styles.overlay}>{renderCategoryList()}</View>
      )}
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '60%', // bottom sheet height for first screen
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subContent: {
    flex: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  applyAll: { color: 'red', fontSize: 12 },
  categoryItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryText: { fontSize: 14 },
  search: {
    backgroundColor: '#f2f2f2',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
  },
  sectionTitle: { fontWeight: '600', fontSize: 14, marginVertical: 10, paddingHorizontal: 10 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10 },
  checkboxText: { marginLeft: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: 'red',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  applyBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelText: { color: 'red' },
  applyBtnText: { color: '#fff', fontWeight: '600' },
});
