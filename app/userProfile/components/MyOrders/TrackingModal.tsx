// import React, {useEffect, useMemo, useState} from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ScrollView,
//   Linking,
//   Dimensions,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import axiosInstance from '../../../../config/Api';

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const SHEET_RATIO = 0.7;
// const sheetHeight = Math.round(SCREEN_HEIGHT * SHEET_RATIO);

// const formatCurrency = (v?: number) =>
//   typeof v === 'number' ? `₹${v.toFixed(2)}` : '-';

// type DriverInfo = {
//   driverId?: string | null;
//   lat?: number;
//   lng?: number;
//   status?: string | null;
//   name?: string | null;
//   phone?: string | null;
//   avatar?: string | null;
// };

// type ShippingAddress = {
//   addressId?: string;
//   name?: string;
//   addressLine1?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   pincode?: string;
//   phone?: string;
//   lat?: string | number;
//   lng?: string | number;
// };

// export type OrderItem = {
//   orderItemId: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   finalPrice?: number;
//   itemStatus?: string;
//   brand?: string | null;
//   productImage?: string | null;
//   shippingAddress?: ShippingAddress | null;
//   driver?: DriverInfo | null;
// };

// export type OrderStoreGroup = {
//   storeGroupId: string | number;
//   storeName?: string;
//   storeStatus?: string | null;
//   storeSubtotal?: number;
//   storeTax?: number;
//   storeTotal?: number;
//   storeTotalItems?: number;
//   driver?: DriverInfo | null;
//   items?: OrderItem[];
// };

// export type Order = {
//   orderId: string | number;
//   orderNumber?: string;
//   orderStatus?: string;
//   placedAt?: string | Date;
//   subtotal?: number;
//   shippingFee?: number;
//   grandTotal?: number;
//   items?: OrderItem[];
//   paymentMethod?: string;
//   shippingAddress?: ShippingAddress | null;
//   driver?: DriverInfo | null;
//   metadata?: any;
//   storeGroups?: OrderStoreGroup[];
// };

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   order: Order | null;
//   isCancelling?: boolean;
//   onCancelOrder?: (orderId: string | number) => Promise<void> | void;
//   onCancelStore?: (
//     orderId: string | number,
//     storeGroupId: string | number,
//   ) => Promise<void> | void;
//   navigation?: any;
// };

// type TimelineStep = {
//   key: string;
//   label: string;
//   description?: string;
//   completed: boolean;
//   active: boolean;
//   isStore?: boolean;
//   storeGroupId?: string | number;
// };

// export default function TrackingModal({
//   visible,
//   onClose,
//   order,
//   onCancelOrder,
//   onCancelStore,
//   isCancelling = false,
//   navigation
// }: Props) {
//   // helpers to decide completion/active based on status strings
//   const statusIn = (s?: string | null, list: string[] = []) =>
//     !!s && list.includes(String(s).toUpperCase());

//   // Build timeline dynamically
//   const timeline = useMemo<TimelineStep[]>(() => {
//     if (!order) return [];

//     const s = String(order.orderStatus ?? '').toUpperCase();

//     // Basic completed rules
//     const orderDelivered = s === 'DELIVERED';
//     const outForDelivery = s === 'OUT_FOR_DELIVERY' || s === 'SHIPPED';

//     // Start with confirmed
//     const steps: TimelineStep[] = [
//       {
//         key: 'confirmed',
//         label: 'Order Confirmed',
//         description: 'Your order has been placed successfully.',
//         completed: true,
//         active: s === 'CONFIRMED',
//       },
//     ];

//     // Insert a step per storeGroup (in order)
//     const groups: OrderStoreGroup[] = Array.isArray(order.storeGroups)
//       ? order.storeGroups
//       : [];
//     groups.forEach(g => {
//       const storeStatus = (g.storeStatus ?? '').toUpperCase();
//       // consider PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED as completed for store step
//       const storeCompleted = statusIn(storeStatus, [
//         'PACKED',
//         'SHIPPED',
//         'OUT_FOR_DELIVERY',
//         'DELIVERED',
//       ]);
//       // active if storeStatus indicates PACKED or PROCESSING (user can tune)
//       const storeActive = statusIn(storeStatus, ['PACKED', 'PROCESSING']);

//       steps.push({
//         key: `store-${g.storeGroupId}`,
//         label: g.storeName ?? `Store ${g.storeGroupId}`,
//         description:
//           g.storeStatus && String(g.storeStatus).trim().length > 0
//             ? `Status: ${g.storeStatus}`
//             : `Preparing items at ${g.storeName ?? 'store'}`,
//         completed: storeCompleted || false,
//         active: storeActive || false,
//         isStore: true,
//         storeGroupId: g.storeGroupId,
//       });
//     });

//     // Add global delivery steps
//     steps.push({
//       key: 'out_for_delivery',
//       label: 'Out for Delivery',
//       description: 'Your dasher is on the way.',
//       completed: orderDelivered ? true : outForDelivery,
//       active: outForDelivery,
//     });

//     steps.push({
//       key: 'arriving_soon',
//       label: 'Arriving Soon',
//       description: order?.metadata?.expectedDelivery
//         ? `Expected delivery: ${order.metadata.expectedDelivery}`
//         : 'Expected delivery window',
//       completed: orderDelivered,
//       active: false,
//     });

//     steps.push({
//       key: 'delivered',
//       label: 'Delivered',
//       description: 'Order Delivered Successfully!',
//       completed: orderDelivered,
//       active: orderDelivered,
//     });

//     return steps;
//   }, [order]);

//   // pick driver info (prefer order.driver, fallback to first storeGroup.driver, fallback to shippingAddress)
//   const driver = useMemo<DriverInfo | null>(() => {
//     if (!order) return null;
//     if (
//       order.driver &&
//       (order.driver.name || order.driver.phone || order.driver.lat)
//     )
//       return order.driver;
//     const g = Array.isArray(order.storeGroups) && order.storeGroups[0];
//     if (g?.driver && (g.driver.name || g.driver.phone || g.driver.lat))
//       return g.driver;
//     if (order.shippingAddress) {
//       return {
//         name: order.shippingAddress.name,
//         phone: order.shippingAddress.phone,
//       };
//     }
//     return null;
//   }, [order]);

//   const confirmCancelStore = async storeGroupId => {
//     if (!order || storeGroupId == null) {
//       Alert.alert('Cancel', 'Cannot determine store to cancel.');
//       return;
//     }

//     const group = (order.storeGroups ?? []).find(
//       g => String(g.storeGroupId) === String(storeGroupId),
//     );

//     Alert.alert(
//       'Cancel Store Order',
//       `Cancel items from "${group?.storeName ?? 'Store'}"?`,
//       [
//         {text: 'No', style: 'cancel'},
//         {
//           text: 'Yes, Cancel',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               // Delete store group from backend
//               await axiosInstance.delete(
//                 `/orders/${order.orderId}/store-groups/${storeGroupId}`,
//               );

//               // Locally filter out the removed store group
//               order.storeGroups = order.storeGroups.filter(
//                 g => String(g.storeGroupId) !== String(storeGroupId),
//               );

//               // Also remove any related items (if applicable)
//               if (order.items) {
//                 order.items = order.items.filter(
//                   item => String(item.storeGroupId) !== String(storeGroupId),
//                 );
//               }

//               Alert.alert(
//                 'Cancelled',
//                 `${group?.storeName ?? 'Store'} removed successfully.`,
//               );
//             } catch (err) {
//               console.error('Cancel failed:', err);
//               Alert.alert(
//                 'Cancel failed',
//                 err?.response?.data?.message ?? 'Failed to cancel store.',
//               );
//             }
//           },
//         },
//       ],
//     );
//   };
//   // Cancel entire order
//   const confirmCancelOrder = async () => {
//     if (!order) return;
//     Alert.alert(
//       'Cancel order',
//       'Do you really want to cancel this order? You may not be able to cancel after the driver picks the item.',
//       [
//         {text: 'No', style: 'cancel'},
//         {
//           text: 'Yes, cancel',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               if (!onCancelOrder) {
//                 Alert.alert(
//                   'Cancel not available',
//                   'Cancellation is not enabled here.',
//                 );
//                 return;
//               }
//               await onCancelOrder(order.orderId);
//             } catch (err) {
//               Alert.alert(
//                 'Cancel failed',
//                 (err as any)?.message ?? 'Failed to cancel order',
//               );
//             }
//           },
//         },
//       ],
//     );
//   };

//   // helper: open phone if available
//   const handleCall = (phone?: string | null) => {
//     if (!phone) {
//       Alert.alert('No phone', 'Phone number not available.');
//       return;
//     }
//     Linking.openURL(`tel:${String(phone).replace(/\s+/g, '')}`).catch(() => {
//       Alert.alert('Call failed', 'Unable to place call.');
//     });
//   };

//   // Render driver card - small component inline
//   const DriverCard: React.FC<{d: DriverInfo | null}> = ({d}) => {
//     if (!d) return null;
//     const phone = d.phone ?? order?.shippingAddress?.phone ?? null;
//     const lat = d.lat ?? null;
//     const lng = d.lng ?? null;
//     const name = d.name ?? order?.shippingAddress?.name ?? 'Delivery Partner';

//     return (
//       <View style={styles.driverCard}>
//         <View style={styles.driverLeft}>
//           <View style={styles.driverAvatar}>
//             {d.avatar ? (
//               <Image source={{uri: d.avatar}} style={styles.avatarImg} />
//             ) : (
//               <Ionicons name="person" size={20} color="#666" />
//             )}
//           </View>
//           <View>
//             <Text style={styles.driverLabel}>Your Delivery Partner</Text>
//             <Text style={styles.driverName}>{name}</Text>
//           </View>
//         </View>

//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <TouchableOpacity
//             style={[styles.actionCircle, styles.callAction]}
//             onPress={() => handleCall(phone)}>
//             <Ionicons name="call" size={16} color="#fff" />
//           </TouchableOpacity>

//           <View style={{width: 8}} />
//         </View>
//       </View>
//     );
//   };

//   // storeGroups for rendering order-cards
//   const groups = (order?.storeGroups ?? []) as OrderStoreGroup[];

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent
//       onRequestClose={onClose}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.backdrop} />
//       </TouchableWithoutFeedback>

//       <View style={[styles.sheetContainer, {height: sheetHeight}]}>
//         {/* header */}
//         <View style={styles.header}>
//           <View style={{flex: 1}}>
//             <Text style={styles.headerTitle}>
//               Order ID #{order?.orderNumber ?? order?.orderId}
//             </Text>
//             <Text style={styles.headerSubtitle}>
//               {order?.metadata?.deliveryPartner ?? '—'}
//             </Text>
//             <Text style={styles.headerMeta}>
//               {order?.metadata?.expectedDelivery
//                 ? `Expected delivery: ${order.metadata.expectedDelivery}`
//                 : 'Expected delivery time not available'}
//             </Text>
//           </View>

//           <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
//             <Ionicons name="close" size={20} color="#333" />
//           </TouchableOpacity>
//         </View>

//         {/* driver card */}
//         <DriverCard d={driver} />

//         {/* content */}
//         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//           <View style={styles.timeline}>
//             {timeline.map((step, idx) => (
//               <View key={step.key} style={styles.timelineItem}>
//                 <View style={styles.timelineIconContainer}>
//                   <View
//                     style={[
//                       styles.timelineIcon,
//                       step.completed ? styles.timelineIconDone : undefined,
//                     ]}>
//                     {step.completed ? (
//                       <Ionicons name="checkmark" size={12} color="#fff" />
//                     ) : (
//                       <View style={styles.timelineIconEmpty} />
//                     )}
//                   </View>

//                   {idx < timeline.length - 1 && (
//                     <View
//                       style={[
//                         styles.timelineLine,
//                         step.completed ? styles.timelineLineDone : undefined,
//                       ]}
//                     />
//                   )}
//                 </View>

//                 <View style={styles.timelineContent}>
//                   <Text
//                     style={[
//                       styles.timelineLabel,
//                       step.completed ? styles.timelineLabelDone : undefined,
//                     ]}>
//                     {step.label}
//                   </Text>
//                   {step.description ? (
//                     <Text style={styles.timelineDescription}>
//                       {step.description}
//                     </Text>
//                   ) : null}

//                   {/* Cancel button for store steps where not completed */}
//                   {step.isStore &&
//                     !step.completed &&
//                     step.storeGroupId != null && (
//                       <TouchableOpacity
//                         style={styles.cancelButton}
//                         onPress={() => confirmCancelStore(step.storeGroupId)}>
//                         <Text style={styles.cancelButtonText}>Cancel</Text>
//                       </TouchableOpacity>
//                     )}
//                 </View>
//               </View>
//             ))}
//           </View>

//           {/* Your Orders Includes */}
//           <View style={styles.ordersSection}>
//             <Text style={styles.ordersTitle}>Your Orders Includes :</Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.orderCardsContainer}>
//               {groups.map(g => (
//                 <TouchableOpacity
//                   key={String(g.storeGroupId)}
//                   style={styles.orderCard}
//                   activeOpacity={0.8}
//                   onPress={() => {
//                     if (navigation) {
//                       navigation.navigate('StoreOrderDetails', {
//                         order,
//                         storeGroup: g,
//                       });
//                     } else {
//                       Alert.alert('Open store', g.storeName ?? 'Store');
//                     }
//                   }}>
//                   <View key={String(g.storeGroupId)} style={styles.orderCard}>
//                     {g.items?.[0]?.productImage ? (
//                       <Image
//                         source={{uri: g.items[0].productImage as any}}
//                         style={styles.orderCardImage}
//                       />
//                     ) : (
//                       <View style={styles.orderCardImagePlaceholder}>
//                         <Ionicons name="image-outline" size={28} color="#ccc" />
//                       </View>
//                     )}

//                     <Text style={styles.orderCardStore}>
//                       {g.storeName ?? 'Store'}
//                     </Text>
//                     <Text style={styles.orderCardItems}>
//                       {g.storeTotalItems ?? g.items?.length ?? 0} items
//                     </Text>
//                     <Text style={styles.orderCardDelivery}>
//                       {order?.metadata?.expectedDelivery ?? 'Delivering soon'}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//   },
//   sheetContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     overflow: 'hidden',
//   },

//   header: {
//     paddingHorizontal: 16,
//     paddingTop: 14,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 2,
//   },
//   headerSubtitle: {fontSize: 13, color: '#666'},
//   headerMeta: {fontSize: 11, color: '#999'},
//   closeIcon: {marginLeft: 12, padding: 6},

//   driverCard: {
//     marginHorizontal: 16,
//     marginTop: 12,
//     padding: 12,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',

//     // subtle shadow
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: {width: 0, height: 2},
//     elevation: 2,
//   },
//   driverLeft: {flexDirection: 'row', alignItems: 'center'},
//   driverAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F3F3',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     overflow: 'hidden',
//   },
//   avatarImg: {width: 48, height: 48},
//   driverLabel: {fontSize: 11, color: '#9AA0A6', marginBottom: 2},
//   driverName: {fontSize: 14, fontWeight: '700', color: '#222'},

//   actionCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 6,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.02,
//     shadowRadius: 2,
//     shadowOffset: {width: 0, height: 1},
//   },
//   callAction: {backgroundColor: '#FF5964'},
//   trackAction: {backgroundColor: '#4A90E2'},

//   content: {flex: 1},

//   timeline: {paddingHorizontal: 16, paddingVertical: 18},
//   timelineItem: {flexDirection: 'row', marginBottom: 12},
//   timelineIconContainer: {alignItems: 'center', marginRight: 14, width: 28},
//   timelineIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#EDEDED',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timelineIconDone: {backgroundColor: '#FF5964'},
//   timelineIconEmpty: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
//   timelineLine: {width: 2, flex: 1, backgroundColor: '#EDEDED', marginTop: 6},
//   timelineLineDone: {backgroundColor: '#FF5964'},
//   timelineContent: {flex: 1, paddingBottom: 8},
//   timelineLabel: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 4,
//   },
//   timelineLabelDone: {color: '#000'},
//   timelineDescription: {fontSize: 13, color: '#999', lineHeight: 18},

//   cancelButton: {
//     backgroundColor: '#FFECEC',
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     alignSelf: 'flex-start',
//     marginTop: 8,
//   },
//   cancelButtonText: {fontSize: 12, fontWeight: '600', color: '#FF5964'},

//   ordersSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//   },
//   ordersTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 12,
//   },
//   orderCardsContainer: {paddingRight: 16},
//   orderCard: {
//     width: 140,
//     marginRight: 12,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//     padding: 8,
//   },
//   orderCardImage: {
//     width: '100%',
//     height: 110,
//     borderRadius: 6,
//     backgroundColor: '#F5F5F5',
//     marginBottom: 8,
//   },
//   orderCardImagePlaceholder: {
//     width: '100%',
//     height: 110,
//     borderRadius: 6,
//     backgroundColor: '#F5F5F5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   orderCardStore: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 2,
//   },
//   orderCardItems: {fontSize: 12, color: '#666', marginBottom: 4},
//   orderCardDelivery: {fontSize: 11, color: '#999'},
// });

import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../../../config/Api';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SHEET_RATIO = 0.7;
const sheetHeight = Math.round(SCREEN_HEIGHT * SHEET_RATIO);

const formatCurrency = (v?: number) =>
  typeof v === 'number' ? `₹${v.toFixed(2)}` : '-';

type DriverInfo = {
  driverId?: string | null;
  lat?: number;
  lng?: number;
  status?: string | null;
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
};

type ShippingAddress = {
  addressId?: string;
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  lat?: string | number;
  lng?: string | number;
};

export type OrderItem = {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  finalPrice?: number;
  itemStatus?: string;
  brand?: string | null;
  productImage?: string | null;
  shippingAddress?: ShippingAddress | null;
  driver?: DriverInfo | null;
  storeGroupId?: string | number;
};

export type OrderStoreGroup = {
  storeGroupId: string | number;
  storeName?: string;
  storeStatus?: string | null;
  storeSubtotal?: number;
  storeTax?: number;
  storeTotal?: number;
  storeTotalItems?: number;
  driver?: DriverInfo | null;
  items?: OrderItem[];
};

export type Order = {
  orderId: string | number;
  orderNumber?: string;
  orderStatus?: string;
  placedAt?: string | Date;
  subtotal?: number;
  shippingFee?: number;
  grandTotal?: number;
  items?: OrderItem[];
  paymentMethod?: string;
  shippingAddress?: ShippingAddress | null;
  driver?: DriverInfo | null;
  metadata?: any;
  storeGroups?: OrderStoreGroup[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  isCancelling?: boolean;
  onCancelOrder?: (orderId: string | number) => Promise<void> | void;
  onCancelStore?: (
    orderId: string | number,
    storeGroupId: string | number,
  ) => Promise<void> | void;
  navigation?: any;
  distance?: number;
};

type TimelineStep = {
  key: string;
  label: string;
  description?: string;
  completed: boolean;
  active: boolean;
  isStore?: boolean;
  storeGroupId?: string | number;
  eta?: number | string | null;
  showViewDetails?: boolean;
};

export default function TrackingModal({
  visible,
  onClose,
  order,
  onCancelOrder,
  onCancelStore,
  isCancelling = false,
  navigation,
  distance,
  eta,
}: Props) {
  // Local copy of order so we can update UI instantly (immutable)
  const [localOrder, setLocalOrder] = useState<Order | null>(order);
  console.log('Order', order);
  // Sync incoming prop changes (e.g. parent refreshed order)
  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  // helpers
  const statusIn = (s?: string | null, list: string[] = []) =>
    !!s && list.includes(String(s).toUpperCase());

  // Timeline computed from localOrder
  const timeline = useMemo<TimelineStep[]>(() => {
    if (!localOrder) return [];

    const s = String(localOrder.orderStatus ?? '').toUpperCase();
    const orderDelivered = s === 'DELIVERED';
    const outForDelivery = s === 'OUT_FOR_DELIVERY' || s === 'SHIPPED';

    const steps: TimelineStep[] = [
      {
        key: 'confirmed',
        label: 'Order Confirmed',
        description: 'Your order has been placed successfully.',
        completed: true,
        active: s === 'CONFIRMED',
        showViewDetails: true,
      },
    ];

    const groups: OrderStoreGroup[] = Array.isArray(localOrder.storeGroups)
      ? localOrder.storeGroups
      : [];

    groups.forEach(g => {
      const storeStatus = (g.storeStatus ?? '').toUpperCase();
      const storeCompleted = statusIn(storeStatus, [
        'PACKED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
      ]);
      const storeActive = statusIn(storeStatus, ['PACKED', 'PROCESSING']);

      steps.push({
        key: `store-${g.storeGroupId}`,
        label: g.storeName ?? `Store ${g.storeGroupId}`,
        description:
          g.storeStatus && String(g.storeStatus).trim().length > 0
            ? `Status: ${g.storeStatus}`
            : `Preparing items at ${g.storeName ?? 'store'}`,
        completed: storeCompleted || false,
        active: storeActive || false,
        isStore: true,
        storeGroupId: g.storeGroupId,
      });
    });

    steps.push({
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      description: 'Your dasher is on the way.',
      completed: orderDelivered ? true : outForDelivery,
      active: outForDelivery,
    });

    steps.push({
      key: 'arriving_soon',
      label: 'Arriving Soon',
      description: localOrder?.metadata?.expectedDelivery
        ? `Expected delivery: ${localOrder.metadata.expectedDelivery}`
        : 'Expected delivery window',
      completed: orderDelivered,
      active: false,
    });

    steps.push({
      key: 'delivered',
      label: 'Delivered',
      description: 'Order Delivered Successfully!',
      completed: orderDelivered,
      active: orderDelivered,
    });

    return steps;
  }, [localOrder]);

  // pick driver info from localOrder
  const driver = useMemo<DriverInfo | null>(() => {
    if (!localOrder) return null;
    if (
      localOrder.driver &&
      (localOrder.driver.name ||
        localOrder.driver.phone ||
        localOrder.driver.lat)
    )
      return localOrder.driver;
    const g =
      Array.isArray(localOrder.storeGroups) && localOrder.storeGroups[0];
    if (g?.driver && (g.driver.name || g.driver.phone || g.driver.lat))
      return g.driver;
    if (localOrder.shippingAddress) {
      return {
        name: localOrder.shippingAddress.name,
        phone: localOrder.shippingAddress.phone,
      };
    }
    return null;
  }, [localOrder]);

  // ------------------------------
  // Cancel a store (optimistic -> update localOrder immutably)
  // ------------------------------
  const confirmCancelStore = async (storeGroupId: string | number) => {
    if (!localOrder || storeGroupId == null) {
      Alert.alert('Cancel', 'Cannot determine store to cancel.');
      return;
    }

    const group = (localOrder.storeGroups ?? []).find(
      g => String(g.storeGroupId) === String(storeGroupId),
    );

    Alert.alert(
      'Cancel Store Order',
      `Cancel items from "${group?.storeName ?? 'Store'}"?`,
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            // Optimistic UI update: remove store locally first for instant feedback
            const updatedLocal = {
              ...localOrder,
              storeGroups: (localOrder.storeGroups ?? []).filter(
                g => String(g.storeGroupId) !== String(storeGroupId),
              ),
              items: (localOrder.items ?? []).filter(
                it => String(it.storeGroupId) !== String(storeGroupId),
              ),
            };
            setLocalOrder(updatedLocal);

            try {
              // prefer parent handler if provided
              if (onCancelStore) {
                await onCancelStore(localOrder.orderId, storeGroupId);
              } else {
                // fallback: call API directly
                await axiosInstance.delete(
                  `/orders/${localOrder.orderId}/store-groups/${storeGroupId}`,
                );
              }

              Alert.alert(
                'Cancelled',
                `${group?.storeName ?? 'Store'} removed successfully.`,
              );
            } catch (err: any) {
              // rollback to the previous snapshot if API failed
              console.error('Cancel failed:', err);
              Alert.alert(
                'Cancel failed',
                err?.response?.data?.message ?? 'Failed to cancel store.',
              );
              // Re-fetch / revert: the simplest safe approach is to put original order back.
              // If caller provided updated data via props you may want to wait for that. Here we naïvely revert.
              setLocalOrder(order);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const confirmCancelOrder = async () => {
    if (!localOrder) return;
    Alert.alert(
      'Cancel order',
      'Do you really want to cancel this order? You may not be able to cancel after the driver picks the item.',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: async () => {
            // optimistic local update: set status to CANCELLED
            const prev = localOrder;
            setLocalOrder({...localOrder, orderStatus: 'CANCELLED'});

            try {
              if (onCancelOrder) {
                await onCancelOrder(localOrder.orderId);
              } else {
                // backend soft-delete or cancel endpoint (adjust if different)
                await axiosInstance.delete(`/orders/${localOrder.orderId}`);
              }
              Alert.alert('Cancelled', 'Order cancelled successfully.');
            } catch (err: any) {
              console.error('Order cancel failed', err);
              Alert.alert(
                'Cancel failed',
                err?.response?.data?.message ?? 'Failed to cancel order',
              );
              // revert
              setLocalOrder(prev);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  // helper: call phone
  const handleCall = (phone?: string | null) => {
    if (!phone) {
      Alert.alert('No phone', 'Phone number not available.');
      return;
    }
    Linking.openURL(`tel:${String(phone).replace(/\s+/g, '')}`).catch(() => {
      Alert.alert('Call failed', 'Unable to place call.');
    });
  };
  const onViewDetails = () => {
    console.log('Clicked on view details');
  };

  // DriverCard - uses localOrder/driver
  const DriverCard: React.FC<{d: DriverInfo | null}> = ({d}) => {
    if (!d) return null;
    const phone = d.phone ?? localOrder?.shippingAddress?.phone ?? null;
    const name =
      d.name ?? localOrder?.shippingAddress?.name ?? 'Delivery Partner';
    return (
      <View style={styles.driverCard}>
        <View style={styles.driverLeft}>
          <View style={styles.driverAvatar}>
            {d.avatar ? (
              <Image source={{uri: d.avatar}} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person-outline" size={20} color="#666" />
            )}
          </View>
          <View>
            <Text style={styles.driverLabel}>Your Delivery Partner</Text>
            <Text style={styles.driverName}>{name}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={[styles.actionCircle, styles.callAction]}
            onPress={() => handleCall(phone)}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{width: 8}} />
        </View>
      </View>
    );
  };

  // storeGroups for rendering
  const groups = (localOrder?.storeGroups ?? []) as OrderStoreGroup[];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheetContainer, {height: sheetHeight}]}>
        {/* header */}
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Text style={styles.headerTitle}>
              Order ID #{localOrder?.orderNumber ?? localOrder?.orderId}
            </Text>
            <Text style={styles.headerMeta}>
              {/* {localOrder?.metadata?.expectedDelivery
                ? `Expected delivery: ${localOrder.metadata.expectedDelivery}`
                : "Expected delivery time not available"}{distance} */}
              Expected Delivery in {eta}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* driver card */}
        <DriverCard d={driver} />

        {/* content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.timeline}>
            {timeline.map((step, idx) => (
              <View key={step.key} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View
                    style={[
                      styles.timelineIcon,
                      step.completed ? styles.timelineIconDone : undefined,
                    ]}>
                    {step.completed ? (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    ) : (
                      <View style={styles.timelineIconEmpty} />
                    )}
                  </View>

                  {idx < timeline.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.completed ? styles.timelineLineDone : undefined,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <View>
                    <Text
                      style={[
                        styles.timelineLabel,
                        step.completed ? styles.timelineLabelDone : undefined,
                      ]}>
                      {step.label}
                    </Text>
                    
                    {step.description ? (
                      <Text style={styles.timelineDescription}>
                        {step.description}
                      </Text>
                    ) : null}
                  </View>
                    {step.showViewDetails && (
                      <TouchableOpacity onPress={onViewDetails}>
                        <Text style={styles.viewDetailsText}>View 
                          details</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#FF6B6B"
                        />
                      </TouchableOpacity>
                    )}
                  {step.isStore &&
                    !step.completed &&
                    step.storeGroupId != null && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => confirmCancelStore(step.storeGroupId!)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            ))}
          </View>

          {/* Your Orders Includes */}
          {/* <View style={styles.ordersSection}>
            <Text style={styles.ordersTitle}>Your Orders Includes :</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.orderCardsContainer}>
              {groups.map(g => (
                <TouchableOpacity
                  key={String(g.storeGroupId)}
                  style={styles.orderCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (navigation) {
                      // pass the latest localOrder and the storeGroup
                      navigation.navigate('StoreOrderDetails', {
                        order: localOrder,
                        storeGroup: g,
                      });
                    } else {
                      Alert.alert('Open store', g.storeName ?? 'Store');
                    }
                  }}>
                  {g.items?.[0]?.productImage ? (
                    <Image
                      source={{uri: g.items[0].productImage as any}}
                      style={styles.orderCardImage}
                    />
                  ) : (
                    <View style={styles.orderCardImagePlaceholder}>
                      <Ionicons name="image-outline" size={28} color="#ccc" />
                    </View>
                  )}

                  <Text style={styles.orderCardStore}>
                    {g.storeName ?? 'Store'}
                  </Text>
                  <Text style={styles.orderCardItems}>
                    {g.storeTotalItems ?? g.items?.length ?? 0} items
                  </Text>
                  <Text style={styles.orderCardDelivery}>
                    {localOrder?.metadata?.expectedDelivery ??
                      'Delivering soon'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View> */}

          {/* optional cancel order action at bottom of modal */}
          {/* <View style={{padding: 16}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#FFECEC',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={confirmCancelOrder}>
              <Text style={{color: '#FF5964', fontWeight: '700'}}>
                Cancel Entire Order
              </Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {fontSize: 13, color: '#666'},
  headerMeta: {fontSize: 11, color: '#999'},
  closeIcon: {marginLeft: 12, padding: 6},

  driverCard: {
    // marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
    elevation: 4,
  },
  avatarImg: {width: 48, height: 48},
  driverLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    // marginBottom: 2,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  driverName: {fontSize: 12, fontWeight: '400', color: '#636363'},

  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
  callAction: {
    backgroundColor: '#FF5964',
  },
  trackAction: {
    backgroundColor: '#4A90E2',
  },

  content: {
    flex: 1,
  },

  timeline: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 5,
    width: 28,
  },
  timelineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#AAAAAA',
  },
  timelineIconDone: {
    backgroundColor: '#FF5964',
    borderColor: '#FF5964',
  },
  timelineIconEmpty: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#AAA',
  },
  timelineLineDone: {backgroundColor: '#FF5964'},
  timelineContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 0.1,
  },
  timelineLabelDone: {
    color: '#000',
  },
  timelineDescription: {
    fontSize: 10,
    fontWeight: '400',
    color: '#000',
    lineHeight: 18,
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#FF5964',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: 'flex-start',
    // marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },

  ordersSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ordersTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  orderCardsContainer: {paddingRight: 16},
  orderCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 8,
  },
  orderCardImage: {
    width: '100%',
    height: 110,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  orderCardImagePlaceholder: {
    width: '100%',
    height: 110,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCardStore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  orderCardItems: {fontSize: 12, color: '#666', marginBottom: 4},
  orderCardDelivery: {fontSize: 11, color: '#999'},
});
