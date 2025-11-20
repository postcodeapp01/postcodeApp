import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface FilterBarProps {
  sortBy: string;
  filterBy: string;
  onSortChange: (sort: string) => void;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ sortBy, filterBy, onSortChange, onFilterChange }) => {
  const sortOptions = [
    { key: 'default', label: 'Default' },
    { key: 'price_low_to_high', label: 'Price: Low to High' },
    { key: 'price_high_to_low', label: 'Price: High to Low' },
    { key: 'rating', label: 'Rating' },
    { key: 'newest', label: 'Newest' },
  ];

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'discount', label: 'On Sale' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'price_low', label: 'Under ₹1000' },
    { key: 'price_high', label: 'Above ₹1000' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Sort Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort:</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                sortBy === option.key && styles.selectedOption
              ]}
              onPress={() => onSortChange(option.key)}
            >
              <Text style={[
                styles.optionText,
                sortBy === option.key && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filter Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter:</Text>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                filterBy === option.key && styles.selectedOption
              ]}
              onPress={() => onFilterChange(option.key)}
            >
              <Text style={[
                styles.optionText,
                filterBy === option.key && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: '#8B5CF6',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
});

export default FilterBar;
