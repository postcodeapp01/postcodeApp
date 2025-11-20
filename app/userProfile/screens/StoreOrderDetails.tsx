
import React, { useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RouteParams = {
  order: any;
  storeGroup: any;
};

const formatCurrency = (v?: number) =>
  typeof v === 'number' ? `₹${v.toFixed(2)}` : '-';

export default function StoreOrderDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order, storeGroup } = route.params as RouteParams;

  if (!order || !storeGroup) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Missing order or store data</Text>
      </SafeAreaView>
    );
  }

  const items: any[] = storeGroup.items ?? [];

  const subtotal = Number(storeGroup.storeSubtotal ?? items.reduce((s, it) => s + Number(it.finalPrice ?? it.price ?? 0), 0));
  const shipping = Number(storeGroup.storeShippingFee ?? 0);
  const tax = Number(storeGroup.storeTax ?? 0);
  const discount = Number(storeGroup.storeDiscount ?? 0);
  const other = 0;
  const total = Number(((subtotal - discount) + shipping + tax + other).toFixed(2));

  const handleNeedHelp = () => {
    Alert.alert('Need Help?', 'Open support chat or call support number.');
  };

  const handleDownloadInvoice = async () => {
    
    try {
      await Share.share({
        message: `Invoice for ${order.orderNumber} - ${storeGroup.storeName}\nTotal: ${formatCurrency(total)}`,
        title: `Invoice ${order.orderNumber}`,
      });
    } catch (e) {
      console.warn('Share failed', e);
      Alert.alert('Download failed', 'Unable to download invoice.');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.itemRow}>
        <View style={styles.itemImageWrap}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          ) : (
            <View style={styles.itemImagePlaceholder}><Ionicons name="image-outline" size={28} color="#ccc" /></View>
          )}
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.productName ?? item.product_name ?? 'Product'}</Text>
          <Text style={styles.itemMeta}>
            {item.brand ? `${item.brand} • ` : ''}
            {item.size ? `Size: ${item.size} • ` : ''}
            Qty: {item.quantity ?? item.qty ?? 1}
          </Text>
          <View style={styles.itemBottomRow}>
            <Text style={styles.itemPrice}>{formatCurrency(Number(item.finalPrice ?? item.price ?? 0))}</Text>
            <Text style={styles.itemNote}>{item.itemStatus ?? item.status ?? ''}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{storeGroup.storeName ?? 'Store'}</Text>
          <Text style={styles.headerSubtitle}>
            {order.shippingAddress?.addressLine1 ?? order.shippingAddress?.address_line1 ?? ''}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* items */}
      <FlatList
        data={items}
        keyExtractor={(it, idx) => `${it.orderItemId ?? it.productId ?? idx}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items from {storeGroup.storeName}</Text>
            <Text style={styles.sectionSub}>{storeGroup.storeTotalItems ?? items.length} items</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      {/* bill details */}
      <View style={styles.billCard}>
        <Text style={styles.billTitle}>Bill Details</Text>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Products Total</Text>
          <Text style={styles.billValue}>{formatCurrency(subtotal)}</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery partner fee</Text>
          <Text style={styles.billValue}>{formatCurrency(0)}</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery fee</Text>
          <Text style={styles.billValue}>{formatCurrency(shipping)}</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>GST and product charges</Text>
          <Text style={styles.billValue}>{formatCurrency(tax)}</Text>
        </View>

        {discount > 0 && (
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={styles.billValue}>-{formatCurrency(discount)}</Text>
          </View>
        )}

        <View style={[styles.billRow, styles.billTotalRow]}>
          <Text style={styles.billTotalLabel}>Total Bill</Text>
          <Text style={styles.billTotalValue}>{formatCurrency(total)}</Text>
        </View>

        {/* action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.helpBtn} onPress={handleNeedHelp}>
            <Text style={styles.helpText}>Need Help?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.invoiceBtn} onPress={handleDownloadInvoice}>
            <Text style={styles.invoiceText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  headerSubtitle: { fontSize: 12, color: '#777', marginTop: 4 },

  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  sectionHeader: { marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  sectionSub: { fontSize: 12, color: '#888', marginTop: 4 },

  itemRow: { flexDirection: 'row', paddingVertical: 12 },
  itemImageWrap: { width: 86, height: 86, borderRadius: 8, overflow: 'hidden', backgroundColor: '#F6F6F6', marginRight: 12 },
  itemImage: { width: '100%', height: '100%' },
  itemImagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  itemInfo: { flex: 1, justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#222' },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 6 },
  itemBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#111' },
  itemNote: { fontSize: 12, color: '#999' },

  sep: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },

  billCard: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  billTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billLabel: { color: '#666' },
  billValue: { color: '#222', fontWeight: '600' },
  billTotalRow: { borderTopWidth: 1, borderTopColor: '#F5F5F5', marginTop: 8, paddingTop: 8 },
  billTotalLabel: { fontSize: 16, fontWeight: '700' },
  billTotalValue: { fontSize: 16, fontWeight: '700' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  helpBtn: { backgroundColor: '#FF6B6B', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  helpText: { color: '#fff', fontWeight: '700' },
  invoiceBtn: { backgroundColor: '#F3F3F3', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, flex: 1, marginLeft: 8, alignItems: 'center' },
  invoiceText: { color: '#333', fontWeight: '700' },
});
