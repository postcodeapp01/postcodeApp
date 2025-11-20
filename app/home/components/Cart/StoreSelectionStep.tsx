import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {StoreGroup} from '../../../reduxSlices/cartSlice';
import StoreAndProducts from './StoreAndProducts';

interface StoreSelectionStepProps {
  storeGroups: StoreGroup[];
  onStoreSelect: (storeId: number) => void;
}

const StoreSelectionStep: React.FC<StoreSelectionStepProps> = ({
  storeGroups,
  onStoreSelect,
}) => {
  const renderStoreCard = ({item: store}: {item: StoreGroup}) => {
    const sumOriginal = store.items.reduce((acc, it) => {
      const op = Number(parseFloat(it.originalPrice));
      const qty = Number(it.qty) || 0;
      return acc + op * qty;
    }, 0);
    return (
      <>
      <StoreAndProducts store={store}/>
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => onStoreSelect(store.store_id)}>
        <Text style={styles.checkoutText}>Go to Checkout</Text>
      </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select a Store to Checkout</Text>
      </View>

      <FlatList
        data={storeGroups}
        keyExtractor={item => item.store_id.toString()}
        renderItem={renderStoreCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImageContainer: {
    width: 42, 
    height: 42,
    // borderWidth: 1,
    // borderColor: '#848484ff',
    borderRadius: 21, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    marginRight: 10,
    backgroundColor: '#ada5a5ff',
  },
  totalsContainer: {
    width: 110, 
    alignItems: 'flex-end',
    marginRight: 12,
  },
  originalAmount: {
    fontSize: 10,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    lineHeight:15,
    letterSpacing:0.1,
  },
  storeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  listContainer: {
    padding: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop:10,
    paddingBottom:20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeIconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 12,
    color: '#6C757D',
  },
  storeTotal: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#28A745',
    marginTop: 2,
  },
  itemsPreview: {
    padding: 16,
  },
  previewItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginRight: 12,
  },
  previewDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  previewName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  previewMeta: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  moreItems: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  proceedButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  proceedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 8,
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderColor: '#848484ff',
    borderWidth: 1,
  },

  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  checkoutBtn: {
    marginHorizontal: 6,
    backgroundColor: '#FF5964',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight:20,
    letterSpacing: 0.1,
  },
});

export default StoreSelectionStep;
