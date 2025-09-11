import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "offer" | "order";
}

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <TouchableOpacity style={styles.notificationItem}>
    <View style={styles.notificationContent}>
      <View
        style={[
          styles.notificationIcon,
          !notification.isRead && styles.unreadIcon,
        ]}
      >
        <Icon
          name={notification.type === "offer" ? "local-offer" : "shopping-bag"}
          size={24}
          color={!notification.isRead ? "#FF6B6B" : "#666"}
        />
      </View>
      <View style={styles.notificationText}>
        <Text
          style={[
            styles.notificationTitle,
            !notification.isRead && styles.unreadTitle,
          ]}
        >
          {notification.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </View>
  </TouchableOpacity>
);

export default NotificationItem;

const styles = StyleSheet.create({
  notificationItem: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  unreadIcon: {
    backgroundColor: "#fff5f5",
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "600",
    color: "#000",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    marginTop: 4,
  },
});
