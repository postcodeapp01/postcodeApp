// ProductFilterBar.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FiltersModal from '../FiltersModal';
import SortModal from '../SortModal';
import CategoryModal from '../CategoryModal';

type ProductFilterBarProps = {
  onSort: (option: string) => void;
  onFilter: (filters: Record<string, string[]>) => void; // ✅ callback to parent
};

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  onSort,
  onFilter,
}) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [categoryVisible, setCategoryVisible] = useState(false);
  return (
    <View>
      {/* Top Bar */}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setSortVisible(true)}
          style={styles.item}>
          <Icon name="swap-vertical" size={16} color="#fff" />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Sort</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item} onPress={() => setCategoryVisible(true)}>
          <Text style={[styles.text, styles.bold]}>Category</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.item}
          onPress={() => setFiltersVisible(true)}>
          <Icon name="options-outline" size={16} color="#fff" />
          <Text style={styles.text}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Sort Modal */}
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onApply={option => {
          setSelectedSort(option);
          setSortVisible(false);
          if (option !== null) {
            onSort(option); // ✅ inform parent
          }
        }}
      />
      <CategoryModal
        visible={categoryVisible}
        onClose={() => setCategoryVisible(false)}
        onApply={selectedCategories => {
          setCategoryVisible(false);
          console.log("Category  modal",selectedCategories);
          onFilter(selectedCategories); // send filters to parent
        }}
      />

      {/* ✅ Filters Modal */}
      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={filters => {
          setFiltersVisible(false);
          // console.log("In Filter BAr",filters);
          onFilter(filters); // ✅ send filters to parent
        }}
      />
    </View>
  );
};

export default ProductFilterBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FF4C5E',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  textContainer: {
    marginLeft: 4,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
  subText: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
  },
  bold: {
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 25,
    backgroundColor: '#fff',
    opacity: 0.6,
  },
});
