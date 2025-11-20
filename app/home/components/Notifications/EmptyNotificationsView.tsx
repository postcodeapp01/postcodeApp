import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  activeTab: "offers" | "orders";
}

const EmptyNotificationsView: React.FC<Props> = ({ activeTab }) => (
  <View style={styles.emptyContainer}>
    <Image
      source={require("../../../../sources/images/notifications.png")}
      style={styles.image}
    />

    <View style={styles.emptyTextContainer}>
      <Text style={styles.emptyTitle}>
        {activeTab === "offers" ? "No offers yet" : "No order updates yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "offers"
          ? "Stay tuned! We'll notify you about exclusive discounts, price drops & limited-time deals right here."
          : "We'll keep you updated on your order status, delivery updates, and important information here."}
      </Text>
    </View>
  </View>
);

export default EmptyNotificationsView;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: "contain",
    marginBottom: 50,
  },
  emptyTextContainer: {
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
