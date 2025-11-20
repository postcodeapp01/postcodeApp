import React, {useState, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomModalFooter from './BottomModalFooter';
type SortModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (sortOption: string | null) => void;
};

// Sort options
const SORT_OPTIONS = [
  {label: 'Relevance', value: 'relevance'},
  {label: 'Price: Low to High', value: 'priceLowHigh'},
  {label: 'Price: High to Low', value: 'priceHighLow'},
  {label: 'Newest First', value: 'newest'},
  {label: 'Customer Ratings', value: 'rating'},
  {label: 'Popularity', value: 'popularity'},
];

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const ROW_HEIGHT = 45;
const HEADER_HEIGHT = 55;
const FOOTER_HEIGHT = 70;
const MAX_SHEET_HEIGHT = Math.round(SCREEN_HEIGHT * 0.85);
const SortModal: React.FC<SortModalProps> = ({visible, onClose, onApply}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // compute required sheet height for rows + header + footer
  const desiredHeight = useMemo(() => {
    return ROW_HEIGHT * SORT_OPTIONS.length + HEADER_HEIGHT + FOOTER_HEIGHT;
  }, []);

  // final height clipped to max allowed
  const sheetHeight = Math.min(desiredHeight, MAX_SHEET_HEIGHT);
  // if clipped, list should scroll
  const listScrollEnabled = desiredHeight > MAX_SHEET_HEIGHT;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheetContainer, {height: sheetHeight}]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sort By</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <View style={styles.circleButton}>
                <Icon name="close" size={20} color="#AAA" />
              </View>
            </TouchableOpacity>
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
            scrollEnabled={listScrollEnabled}
            contentContainerStyle={listScrollEnabled ? {} : {flexGrow: 1}}
          />

          {/* <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
            <View style={styles.footerInner}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => onApply(selectedOption)}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView> */}
          <BottomModalFooter
            onCancel={onClose}
            onApply={() => onApply(selectedOption)}
            applyDisabled={selectedOption === null}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SortModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',

    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    letterSpacing: -0.32,
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
    color: '#222',
  },
  footerSafe: {
    backgroundColor: '#fff',
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: FOOTER_HEIGHT + 1,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FF4C5E',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#FF4C5E',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  applyButton: {
    backgroundColor: '#FF4C5E',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  applyText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
