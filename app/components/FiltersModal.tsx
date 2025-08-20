import React, {useState, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootState} from '../../Store';
import {useSelector} from 'react-redux';

type FiltersModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, (number | string)[]>) => void; // ✅ Only IDs
};

const FiltersModal: React.FC<FiltersModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [selectedGroup, setSelectedGroup] = useState('Category');
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, (number | string)[]>
  >({});
  const [searchText, setSearchText] = useState('');

  /** ✅ Build Category Groups (Parent → All Level 3 Children) */
  const buildCategoryGroups = () => {
    const groups: Record<string, {id: number; name: string}[]> = {};
    const parents = categories.filter(cat => cat.level === 1);

    parents.forEach(parent => {
      const level2Children = categories.filter(c => c.parent_id === parent.id);
      let level3Products: {id: number; name: string}[] = [];

      level2Children.forEach(l2 => {
        const l3 = categories
          .filter(c => c.parent_id === l2.id && c.level === 3)
          .map(c => ({id: c.id, name: c.name}));
        level3Products = [...level3Products, ...l3];
      });

      if (level3Products.length > 0) {
        groups[parent.name] = level3Products;
      }
    });

    return groups;
  };

  const categoryGroups = useMemo(() => buildCategoryGroups(), [categories]);

  /** ✅ Define filter groups */
  const FILTER_GROUPS: Record<string, any> = {
    Category: categoryGroups,
    Colors: ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow'],
    Price: [
      'Under 500',
      '500 - 1000',
      '1000 - 1500',
      '1500 - 2000',
      '2000 - 2500',
      '2500 - 3000',
      '3000 - 3500',
      '3500 - 4000',
      '4000 - 4500',
      '4500 - 5000',
      '5000+',
    ],
    'Size & Fit': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '1 - 2Y', '2 - 5Y'],
    Brands: ['Nike', 'Adidas', 'Puma', 'Levi’s', 'H&M'],
    Occasion: [
      'Office Wear',
      'Party Wear',
      'Wedding / Ethnic',
      'Festive Wear',
      'Travel / Vacation',
      'Active / Gym',
      'Everyday / Casual',
    ],
    Ratings: ['5', '4 & above', '3 & above', '2 & above', '1 & above'],
  };

  /** ✅ Toggle selection (store only IDs) */
  const toggleSelection = (group: string, id: number | string) => {
    setSelectedFilters(prev => {
      const currentGroup = prev[group] || [];
      const exists = currentGroup.includes(id);

      if (exists) {
        return {
          ...prev,
          [group]: currentGroup.filter(item => item !== id),
        };
      } else {
        return {
          ...prev,
          [group]: [...currentGroup, id],
        };
      }
    });
  };

  /** ✅ Render options */
  const renderOptions = () => {
    const data = FILTER_GROUPS[selectedGroup];

    // Category = object with subgroups
    if (selectedGroup === 'Category' && typeof data === 'object') {
      return (
        <ScrollView>
          {Object.entries(data).map(([subGroup, options]) => {
            const filteredOptions = (options as {id: number; name: string}[]).filter(
              opt =>
                opt.name.toLowerCase().includes(searchText.toLowerCase().trim()),
            );

            if (filteredOptions.length === 0) return null;

            return (
              <View key={subGroup} style={{marginBottom: 15}}>
                <Text style={styles.subGroupTitle}>{subGroup}</Text>
                {filteredOptions.map(opt => {
                  const isSelected = selectedFilters[selectedGroup]?.includes(
                    opt.id,
                  );
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={styles.optionRow}
                      onPress={() => toggleSelection(selectedGroup, opt.id)}>
                      <Icon
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={isSelected ? '#FF4C5E' : '#444'}
                      />
                      <Text style={styles.optionText}>{opt.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      );
    }

    // Brands & other flat arrays (keep them as string IDs)
    const filteredArray =
      selectedGroup === 'Brands' || selectedGroup === 'Colors'
        ? (data as string[]).filter(item =>
            item.toLowerCase().includes(searchText.toLowerCase().trim()),
          )
        : data;

    return (
      <FlatList
        data={filteredArray}
        keyExtractor={item => item.toString()}
        renderItem={({item}) => {
          const isSelected = selectedFilters[selectedGroup]?.includes(item);
          return (
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => toggleSelection(selectedGroup, item)}>
              <Icon
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={22}
                color={isSelected ? '#FF4C5E' : '#444'}
              />
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrow-back" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filters</Text>
          </View>

          <View style={styles.content}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
              {Object.keys(FILTER_GROUPS).map(group => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.sidebarItem,
                    selectedGroup === group && styles.sidebarItemActive,
                  ]}
                  onPress={() => {
                    setSelectedGroup(group);
                    setSearchText('');
                  }}>
                  <Text
                    style={[
                      styles.sidebarText,
                      selectedGroup === group && styles.sidebarTextActive,
                    ]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Options */}
            <View style={styles.optionsArea}>
              <Text style={styles.groupTitle}>{selectedGroup}</Text>

              {(selectedGroup === 'Category' ||
                selectedGroup === 'Brands' ||
                selectedGroup === 'Colors') && (
                <View style={styles.searchBox}>
                  <Icon name="search" size={18} />
                  <TextInput
                    placeholder="Search"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{marginLeft: 8, flex: 1}}
                  />
                </View>
              )}

              {renderOptions()}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => onApply(selectedFilters)}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FiltersModal;


const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'},
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold', marginLeft: 10},
  content: {flex: 1, flexDirection: 'row'},
  sidebar: {width: 120, backgroundColor: '#f8f8f8'},
  sidebarItem: {padding: 12},
  sidebarItemActive: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#FF4C5E',
  },
  sidebarText: {fontSize: 14, color: '#555'},
  sidebarTextActive: {color: '#FF4C5E', fontWeight: 'bold'},
  optionsArea: {flex: 1, padding: 15},
  groupTitle: {fontSize: 16, fontWeight: '600', marginBottom: 10},
  subGroupTitle: {fontSize: 15, fontWeight: '600', marginVertical: 6},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    height: 36,
  },
  optionRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  optionText: {marginLeft: 10, fontSize: 14},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FF4C5E',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelText: {color: '#FF4C5E', fontWeight: '600'},
  applyButton: {
    backgroundColor: '#FF4C5E',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  applyText: {color: '#fff', fontWeight: '600'},
});


