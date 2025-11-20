

import React, { useEffect, useMemo, useState } from "react";
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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axiosInstance from "../../../../config/Api";
import { useSelector } from "react-redux";
import { selectOrderById } from "../../../../reduxSlices/orderSlice";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_RATIO = 0.7;
const sheetHeight = Math.round(SCREEN_HEIGHT * SHEET_RATIO);

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
  order?: Order | null; // optional prop fallback
  orderId?: string | number; // prefer this to select from redux
  isCancelling?: boolean;
  onCancelOrder?: (orderId: string | number) => Promise<void> | void;
  onCancelStore?: (
    orderId: string | number,
    storeGroupId: string | number
  ) => Promise<void> | void;
  navigation?: any;
  distance?: number;
  eta?: string;
  simulationStage?: // optional live stage override coming from parent simulation
    | "PENDING"
    | "CONFIRMED"
    | "PACKED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "NEAR_DELIVERY"
    | "DELIVERED"
    | string;
};

type TimelineStep = {
  key: string;
  label: string;
  description?: string;
  completed: boolean;
  active: boolean;
  isStore?: boolean;
  storeGroupId?: string | number;
  cancellable?: boolean; // new: whether the cancel button should show
  eta?: number | string | null;
  showViewDetails?: boolean;
};

export default function TrackingModal({
  visible,
  onClose,
  order: propOrder = null,
  orderId: propOrderId,
  onCancelOrder,
  onCancelStore,
  isCancelling = false,
  navigation,
  distance,
  eta,
  simulationStage,
}: Props) {
  const selectorOrder = useSelector((s: any) =>
    propOrderId ? selectOrderById(s, propOrderId) : null
  );

  const order: Order | null = (selectorOrder as Order) ?? propOrder ?? null;

  const [localOrderSnapshot, setLocalOrderSnapshot] = useState<Order | null>(order);
  useEffect(() => {
    setLocalOrderSnapshot(order);
  }, [order]);

  const statusIn = (s?: string | null, list: string[] = []) =>
    !!s && list.includes(String(s).toUpperCase());

  const effectiveStage = useMemo(() => {
    if (simulationStage) return String(simulationStage).toUpperCase();
    return String(order?.orderStatus ?? "").toUpperCase();
  }, [order, simulationStage]);

  
  const isStoreCancellable = (g: OrderStoreGroup | undefined, stage: string, allItems?: OrderItem[]) => {
    if (!g) return false;
    const storeStatus = (g.storeStatus ?? "").toUpperCase();
    const blockedStatuses = ["PACKED", "PICKED_UP", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
    if (statusIn(storeStatus, blockedStatuses)) return false; 

    if (stage === "PICKED_UP" || stage === "IN_TRANSIT" || stage === "NEAR_DELIVERY" || stage === "DELIVERED") return false;

    const driver = (g.driver as any) ?? null;
    if (driver && (driver.driverId || driver.lat || driver.lng)) return false;

    const itemBlocked = (g.items ?? allItems ?? []).some((it) => {
      const s = (it.itemStatus ?? "").toUpperCase();
      return ["PICKED_UP", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "COLLECTED"].includes(s);
    });
    if (itemBlocked) return false;

    return true;
  };

  const timeline = useMemo<TimelineStep[]>(() => {
    const local = localOrderSnapshot ?? order;
    if (!local) return [];

    const s = String(local.orderStatus ?? "").toUpperCase();
    const stage = String(effectiveStage ?? s).toUpperCase();

    const orderDelivered = stage === "DELIVERED" || s === "DELIVERED";
    const outForDelivery =
      stage === "OUT_FOR_DELIVERY" || stage === "SHIPPED" || s === "OUT_FOR_DELIVERY" || s === "SHIPPED";

    const steps: TimelineStep[] = [
      {
        key: "confirmed",
        label: "Order Confirmed",
        description: "Your order has been placed successfully.",
        completed: true,
        active: stage === "CONFIRMED" || s === "CONFIRMED",
        showViewDetails: true,
      },
    ];

    const groups: OrderStoreGroup[] = Array.isArray(local.storeGroups) ? local.storeGroups : [];

    groups.forEach((g) => {
      const storeStatus = (g.storeStatus ?? "").toUpperCase();
      const storeCompleted =
        statusIn(storeStatus, ["PACKED", "PICKED_UP", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"]) ||
        stage === "PICKED_UP" ||
        stage === "IN_TRANSIT";

      const storeActive = statusIn(storeStatus, ["PACKED", "PROCESSING"]) || stage === "PACKED";

      const cancellable = isStoreCancellable(g, stage, local.items ?? []);

      steps.push({
        key: `store-${g.storeGroupId}`,
        label: g.storeName ?? `Store ${g.storeGroupId}`,
        description:
          g.storeStatus && String(g.storeStatus).trim().length > 0
            ? `Status: ${g.storeStatus}`
            : `Preparing items at ${g.storeName ?? "store"}`,
        completed: storeCompleted || false,
        active: storeActive || false,
        isStore: true,
        storeGroupId: g.storeGroupId,
        cancellable,
      });
    });

    steps.push({
      key: "out_for_delivery",
      label: "Out for Delivery",
      description: "Your dasher is on the way.",
      completed: orderDelivered ? true : outForDelivery,
      active: outForDelivery,
    });

    steps.push({
      key: "arriving_soon",
      label: "Arriving Soon",
      description: local?.metadata?.expectedDelivery ? `Expected delivery: ${local.metadata.expectedDelivery}` : "Expected delivery window",
      completed: orderDelivered,
      active: stage === "NEAR_DELIVERY",
    });

    steps.push({
      key: "delivered",
      label: "Delivered",
      description: "Order Delivered Successfully!",
      completed: orderDelivered,
      active: orderDelivered,
    });

    return steps;
  }, [localOrderSnapshot, order, effectiveStage]);

  const driver = useMemo<DriverInfo | null>(() => {
    const authoritative = (selectorOrder as Order) ?? propOrder ?? localOrderSnapshot;
    if (!authoritative) return null;
    if (authoritative.driver && (authoritative.driver.name || authoritative.driver.phone || authoritative.driver.lat)) return authoritative.driver;
    const g = Array.isArray(authoritative.storeGroups) && authoritative.storeGroups[0];
    if (g?.driver && (g.driver.name || g.driver.phone || g.driver.lat)) return g.driver;
    if (authoritative.shippingAddress) {
      return {
        name: authoritative.shippingAddress.name,
        phone: authoritative.shippingAddress.phone,
      };
    }
    return null;
  }, [selectorOrder, propOrder, localOrderSnapshot]);

  const confirmCancelStore = async (storeGroupId: string | number) => {
    const local = localOrderSnapshot ?? order;
    if (!local || storeGroupId == null) {
      Alert.alert("Cancel", "Cannot determine store to cancel.");
      return;
    }

    const group = (local.storeGroups ?? []).find((g) => String(g.storeGroupId) === String(storeGroupId));

    Alert.alert(`Cancel items from "${group?.storeName ?? "Store"}"?`, "", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          const updatedLocal = {
            ...local,
            storeGroups: (local.storeGroups ?? []).filter((g) => String(g.storeGroupId) !== String(storeGroupId)),
            items: (local.items ?? []).filter((it) => String(it.storeGroupId) !== String(storeGroupId)),
          };
          setLocalOrderSnapshot(updatedLocal);

          try {
            if (onCancelStore) {
              await onCancelStore(local.orderId!, storeGroupId);
            } else {
              await axiosInstance.delete(`/orders/${local.orderId}/store-groups/${storeGroupId}`);
            }
            Alert.alert("Cancelled", `${group?.storeName ?? "Store"} removed successfully.`);
          } catch (err: any) {
            console.error("Cancel failed:", err);
            Alert.alert("Cancel failed", err?.response?.data?.message ?? "Failed to cancel store.");
            
            setLocalOrderSnapshot(order);
          }
        },
      },
    ]);
  };

  const confirmCancelOrder = async () => {
    const local = localOrderSnapshot ?? order;
    if (!local) return;
    Alert.alert("Cancel order", "Do you really want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          const prev = local;
          setLocalOrderSnapshot({ ...local, orderStatus: "CANCELLED" });
          try {
            if (onCancelOrder) await onCancelOrder(local.orderId!);
            else await axiosInstance.delete(`/orders/${local.orderId}`);
            Alert.alert("Cancelled", "Order cancelled successfully.");
          } catch (err: any) {
            console.error("Order cancel failed", err);
            Alert.alert("Cancel failed", err?.response?.data?.message ?? "Failed to cancel order");
            setLocalOrderSnapshot(prev);
          }
        },
      },
    ]);
  };

  const handleCall = (phone?: string | null) => {
    if (!phone) {
      Alert.alert("No phone", "Phone number not available.");
      return;
    }
    Linking.openURL(`tel:${String(phone).replace(/\s+/g, "")}`).catch(() => {
      Alert.alert("Call failed", "Unable to place call.");
    });
  };

  const onViewDetails = () => {
    navigation?.navigate?.("OrderDetails", { order: order ?? localOrderSnapshot });
  };

  const groups = (localOrderSnapshot?.storeGroups ?? order?.storeGroups ?? []) as OrderStoreGroup[];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheetContainer, { height: sheetHeight }]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Order ID #{order?.orderNumber ?? order?.orderId}</Text>
            <Text style={styles.headerMeta}>Expected Delivery in {eta ?? "--"}</Text>
          </View>

          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <DriverCard d={driver} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.timeline}>
            {timeline.map((step, idx) => (
              <View key={step.key} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, step.completed ? styles.timelineIconDone : undefined]}>
                    {step.completed ? <Ionicons name="checkmark" size={18} color="#fff" /> : <View style={styles.timelineIconEmpty} />}
                  </View>

                  {idx < timeline.length - 1 && <View style={[styles.timelineLine, step.completed ? styles.timelineLineDone : undefined]} />}
                </View>

                <View style={styles.timelineContent}>
                  <View>
                    <Text style={[styles.timelineLabel, step.completed ? styles.timelineLabelDone : undefined]}>{step.label}</Text>

                    {step.description ? <Text style={styles.timelineDescription}>{step.description}</Text> : null}
                  </View>

                  {step.showViewDetails && (
                    <TouchableOpacity onPress={onViewDetails} style={styles.viewDetails}>
                      <Text style={styles.viewDetailsText}>View details</Text>
                      <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}

                  {step.isStore && !step.completed && step.storeGroupId != null && step.cancellable && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => confirmCancelStore(step.storeGroupId!)}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
const DriverCard: React.FC<{ d: DriverInfo | null }> = ({ d }) => {
  if (!d) return null;
  const phone = d.phone ?? undefined;
  const name = d.name ?? "Delivery Partner";
  return (
    <View style={styles.driverCard}>
      <View style={styles.driverLeft}>
        <View style={styles.driverAvatar}>
          {d.avatar ? <Image source={{ uri: d.avatar }} style={styles.avatarImg} /> : <Ionicons name="person-outline" size={20} color="#666" />}
        </View>
        <View>
          <Text style={styles.driverLabel}>Your Delivery Partner</Text>
          <Text style={styles.driverName}>{name}</Text>
          {d.lat != null && d.lng != null ? <Text style={{ fontSize: 11, color: "#666" }}>Lat: {Number(d.lat).toFixed(5)}, Lng: {Number(d.lng).toFixed(5)}</Text> : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={[styles.actionCircle, styles.callAction]} onPress={() => (phone ? Linking.openURL(`tel:${String(phone).replace(/\s+/g, "")}`) : Alert.alert("No phone"))}>
          <Ionicons name="call" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  sheetContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: "hidden" },
  header: { paddingHorizontal: 20, paddingTop: 20, flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 4 },
  headerMeta: { fontSize: 11, color: "#999" },
  closeIcon: { marginLeft: 12, padding: 6 },
  driverCard: { marginTop: 10, paddingVertical: 20, paddingHorizontal: 20, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#aaa" },
  driverLeft: { flexDirection: "row", alignItems: "center" },
  driverAvatar: { width: 40, height: 40, borderRadius: 24, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginRight: 20, overflow: "hidden", elevation: 4 },
  avatarImg: { width: 48, height: 48 },
  driverLabel: { fontSize: 14, color: "#222", fontWeight: "500", lineHeight: 20, letterSpacing: 0.1 },
  driverName: { fontSize: 12, fontWeight: "400", color: "#636363" },
  actionCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 6, elevation: 1 },
  callAction: { backgroundColor: "#FF5964" },
  content: { flex: 1 },
  timeline: { paddingHorizontal: 20, paddingTop: 20 },
  timelineItem: { flexDirection: "row" },
  timelineIconContainer: { alignItems: "center", marginRight: 5, width: 28 },
  timelineIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#AAAAAA" },
  timelineIconDone: { backgroundColor: "#FF5964", borderColor: "#FF5964" },
  timelineIconEmpty: { width: 8, height: 8, borderRadius: 4 },
  timelineLine: { width: 3, flex: 1, backgroundColor: "#AAA" },
  timelineLineDone: { backgroundColor: "#FF5964" },
  timelineContent: { flex: 1, paddingHorizontal: 10, paddingBottom: 30, flexDirection: "row", justifyContent: "space-between" },
  timelineLabel: { fontSize: 14, fontWeight: "500", color: "#000", letterSpacing: 0.1 },
  timelineLabelDone: { color: "#000" },
  timelineDescription: { fontSize: 10, fontWeight: "400", color: "#000", lineHeight: 18 },
  viewDetails: { flexDirection: "row" },
  viewDetailsText: { fontSize: 13, color: "#FF6B6B", fontWeight: "500" },
  cancelButton: { backgroundColor: "#FF5964", paddingVertical: 6, paddingHorizontal: 18, borderRadius: 10, alignSelf: "flex-start" },
  cancelButtonText: { fontSize: 10, fontWeight: "700", color: "#FFF" },
});
