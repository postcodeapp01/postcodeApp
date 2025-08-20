import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type SortModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (sortOption: string | null) => void;
};

// ✅ Sort options
const SORT_OPTIONS = [
  {label: 'Relevance', value: 'relevance'},
  {label: 'Price: Low to High', value: 'priceLowHigh'},
  {label: 'Price: High to Low', value: 'priceHighLow'},
  {label: 'Newest First', value: 'newest'},
  {label: 'Customer Ratings', value: 'rating'},
  {label: 'Popularity', value: 'popularity'},
];

const SortModal: React.FC<SortModalProps> = ({visible, onClose, onApply}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrow-back" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sort By</Text>
          </View>

          {/* Options List */}
          <FlatList
            data={SORT_OPTIONS}
            keyExtractor={item => item.value}
            renderItem={({item}) => {
              const isSelected = selectedOption === item.value;
              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setSelectedOption(item.value)}>
                  <Icon
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={isSelected ? '#FF4C5E' : '#444'}
                  />
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => onApply(selectedOption)}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SortModal;

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'},
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 150,
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  optionText: {marginLeft: 10, fontSize: 15},
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
